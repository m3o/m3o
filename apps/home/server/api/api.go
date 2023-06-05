// Package api provides the API building blocks for distributed
package api

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"net/mail"
	"os"
	"sort"
	"strings"
	"time"

	"go.m3o.com"
	"go.m3o.com/cache"
	"go.m3o.com/db"
	"go.m3o.com/email"
	"go.m3o.com/search"
	"go.m3o.com/user"
	"go.m3o.com/wallet"
)

var (
	AppURL = os.Getenv("M3O_APP_URL")
	// our global M3O API Token
	Token = os.Getenv("M3O_API_TOKEN")
)

// Types
type Group struct {
	Id          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Moderators  []string `json:"moderators"`
	Created     string   `json:"created"`
}

type Post struct {
	Id           string  `json:"id"`
	UserId       string  `json:"userId"`
	Username     string  `json:"username"`
	Content      string  `json:"content"`
	Created      string  `json:"created"`
	Upvotes      float32 `json:"upvotes"`
	Downvotes    float32 `json:"downvotes"`
	Score        float32 `json:"score"`
	Title        string  `json:"title"`
	Url          string  `json:"url"`
	Group        string  `json:"group"`
	CommentCount float32 `json:"commentCount"`
}

type Comment struct {
	Content   string  `json:"content"`
	Parent    string  `json:"group"`
	Upvotes   float32 `json:"upvotes"`
	Downvotes float32 `json:"downvotes"`
	PostId    string  `json:"postId"`
	Username  string  `json:"username"`
	UserId    string  `json:"userId"`
}

type User struct {
	Id       string `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Balance  int64  `json:"balance"`
}

type GroupRequest struct {
	Group     Group  `json:"group"`
	SessionID string `json:"sessionId"`
}

type PostRequest struct {
	Post      Post   `json:"post"`
	SessionID string `json:"sessionId"`
}

type VoteRequest struct {
	Id        string `json:"id"`
	SessionID string `json:"sessionId"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LogoutRequest struct {
	SessionID string `json:"sessionId"`
}

type SignupRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type SettingsRequest struct {
	SessionID string                 `json:"sessionId"`
	Settings  map[string]interface{} `json:"settings"`
}

type ReadSessionRequest struct {
	SessionId string `json:"sessionId"`
}

type CommentRequest struct {
	Comment   Comment `json:"comment"`
	SessionID string  `json:"sessionId"`
}

type CommentsRequest struct {
	PostId string `json:"postId"`
}

type PostsRequest struct {
	Min   int32  `json:"min"`
	Max   int32  `json:"max"`
	Limit int32  `json:"limit"`
	Group string `json:"group"`
	Id    string `json:"id,omitempty"`
}

type GroupsRequest struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Limit int32  `json:"limit"`
}

type UsersRequest struct {
	Id       string `json:"id"`
	Username string `json:"username"`
}

type Handler struct{}

func Client(r *http.Request) *m3o.Client {
	var token string
	// only emails the owner of the token
	if r == nil {
		return m3o.New(token)
	}

	if v := r.Header.Get("Authorization"); strings.HasPrefix(v, "Bearer") {
		token = strings.TrimSpace(strings.TrimPrefix(v, "Bearer"))
	} else if c, err := r.Cookie("micro_token"); err == nil && len(c.Value) > 0 {
		token = c.Value
	} else {
		// global token
		// TODO: remove
		token = Token
	}
	return m3o.New(token)
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// check cor
	if Cors(w, r) {
		return
	}
	// serve the default
	http.DefaultServeMux.ServeHTTP(w, r)
}

// URL returns the url used for links in emails
func URL(r *http.Request) string {
	var scheme string
	var uhost string

	if len(AppURL) > 0 {
		return AppURL
	}

	// not triggered by a request
	if r == nil {
		return "http://localhost:8080"
	}

	if v := r.Header.Get("X-Forwarded-Host"); len(v) > 0 {
		uhost = v
	} else if len(r.Host) > 0 {
		uhost = r.Host
	} else {
		uhost = r.URL.Host
	}

	if len(uhost) == 0 {
		uhost = "localhost:8080"
	}

	if len(r.URL.Scheme) > 0 {
		scheme = r.URL.Scheme
	} else {
		scheme = "http"
	}

	return fmt.Sprintf("%s://%s", scheme, uhost)
}

// parse inbound email
func Email(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(1024 * 1024 * 1024)

	subject := r.Form.Get("subject")
	from := r.Form.Get("from")
	to := r.Form.Get("to")
	text := r.Form.Get("text")

	fmt.Println("Received email", subject, from, to, text)

	// unknown source
	if len(from) == 0 {
		fmt.Println("Email from unknown source")
		return
	}

	email, err := mail.ParseAddress(from)
	if err != nil {
		fmt.Println("Failed to parse from address", err)
		return
	}

	// check we know this user
	user, err := Client(r).User.Read(&user.ReadRequest{
		Email: email.Address,
	})
	if err != nil {
		fmt.Println("Failed to read user", email.Address, err)
		return
	}

	if !user.Account.Verified {
		fmt.Println("User is not verified", email.Address)
		return
	}

	// is a verified user, process it
	toEmail, err := mail.ParseAddress(to)
	if err != nil {
		fmt.Println("Failed to parse to address", err)
		return
	}

	// check if its a group
	parts := strings.Split(toEmail.Address, "@")
	if len(parts) != 2 {
		fmt.Println("Not two parts", len(parts), toEmail.Address)
		return
	}

	// the group we want
	group := parts[0]

	// TODO: enable sending to users, store in their inbox
	// check the group exists

	if !groupExists(r, group) {
		fmt.Println("Group does not exist", group)
		return
	}

	fmt.Println("Posting to", group, "from", user.Account.Username)
	// group exists, ok cool, post it
	p := map[string]interface{}{
		"userId":    user.Account.Id,
		"username":  user.Account.Username,
		"content":   text,
		"url":       "",
		"upvotes":   float64(0),
		"downvotes": float64(0),
		"score":     float64(0),
		"group":     group,
		"title":     subject,
		"created":   time.Now(),
	}

	_, err = Client(r).Db.Create(&db.CreateRequest{
		Table:  "posts",
		Record: p,
	})
	if err != nil {
		fmt.Println("Failed to create post", err)
		return
	}

	// index the post
	go indexData(r, "posts", p)

	// fire an update
	/*
		go emailUsers(
			userID,
			"New post: "+t.Post.Title,
			fmt.Sprintf(`Checkout <a href="%s/#post=%s">%s</a> in #%s`,
				URL(req), crsp.Id, t.Post.Title, strings.Replace(t.Post.Group, " ", "+", -1)),
		)
	*/
}

// helpers
func createPost(r *http.Request, p map[string]interface{}) error {
	_, err := Client(r).Db.Create(&db.CreateRequest{
		Table:  "posts",
		Record: p,
	})

	// index the post
	go indexData(r, "posts", p)

	return err
}

// email user notifications excluding the user created by
func emailUsers(r *http.Request, byUser, subj, msg string) error {
	// get users
	// TODO: cache user list
	rsp, err := Client(r).User.List(&user.ListRequest{Limit: 1000})
	if err != nil {
		return err
	}

	// load user settings
	// TODO: increase load limit
	readRsp, err := Client(r).Db.Read(&db.ReadRequest{
		Table: "settings",
		Limit: 1000,
	})
	if err != nil {
		return err
	}

	// create a send email map
	sendEmail := make(map[string]bool)
	for _, v := range readRsp.Records {
		id := v["userId"].(string)
		send := v["emails"].(bool)
		sendEmail[id] = send
	}

	var emails []string
	for _, user := range rsp.Users {
		// don't send to the poster
		if user.Id == byUser {
			continue
		}
		// don't send if emails disabled
		if send, ok := sendEmail[user.Id]; !ok || !send {
			continue
		}
		// send to this user
		emails = append(emails, user.Email)
	}

	body := fmt.Sprintf(`<!DOCTYPE html><html><body>%s</body></html>`, msg)

	// email each user
	for _, to := range emails {
		Client(r).Email.Send(&email.SendRequest{
			From:     "M3O.org",
			To:       to,
			Subject:  subj,
			HtmlBody: body,
		})
	}
	return nil
}

func groupExists(r *http.Request, name string) bool {
	// check if the group exists
	req := &db.ReadRequest{
		Table: "groups",
		Limit: 1,
		Query: fmt.Sprintf("name == '%v'", name),
	}

	rsp, err := Client(r).Db.Read(req)
	if err == nil && len(rsp.Records) > 0 {
		return true
	}

	return false
}

// upvote or downvote a post or a comment
func vote(w http.ResponseWriter, r *http.Request, upvote bool, isComment bool, t VoteRequest) error {
	if t.Id == "" {
		return fmt.Errorf("missing post id")
	}
	table := "posts"
	if isComment {
		table = "comments"
	}
	rsp, err := Client(r).Db.Read(&db.ReadRequest{
		Table: table,
		Id:    t.Id,
		Limit: 1,
	})
	if err != nil {
		return err
	}
	if len(rsp.Records) == 0 {
		return fmt.Errorf("post or comment not found")
	}

	// auth
	sessionRsp, err := Client(r).User.ReadSession(&user.ReadSessionRequest{
		SessionId: t.SessionID,
	})
	if err != nil {
		return err
	}
	if sessionRsp.Session.UserId == "" {
		return fmt.Errorf("user id not found")
	}

	// prevent double votes
	checkId := table + ":" + t.Id + ":" + sessionRsp.Session.UserId
	checkRsp, err := Client(r).Db.Read(&db.ReadRequest{
		Table: "votes",
		Id:    checkId,
	})
	// don't allow double voting
	if err == nil && (checkRsp != nil && len(checkRsp.Records) > 0) {
		return fmt.Errorf("already voted")
	}

	// add the vote sync
	go func() {
		_, err = Client(r).Db.Create(&db.CreateRequest{
			Table: "votes",
			Record: map[string]interface{}{
				"id": checkId,
			},
		})
		if err != nil {
			fmt.Println("failed to add vote", err)
		}
	}()

	val := float64(1)

	obj := rsp.Records[0]
	key := "upvotes"
	if !upvote {
		key = "downvotes"
	}

	if _, ok := obj["upvotes"].(float64); !ok {
		obj["upvotes"] = float64(0)
	}
	if _, ok := obj["downvotes"].(float64); !ok {
		obj["downvotes"] = float64(0)
	}

	obj[key] = obj[key].(float64) + val
	obj["score"] = obj["upvotes"].(float64) - obj["downvotes"].(float64)

	// update the upvote for the post or comment
	_, err = Client(r).Db.Update(&db.UpdateRequest{
		Table:  table,
		Id:     t.Id,
		Record: obj,
	})

	if err != nil {
		return err
	}

	// async the indexing and credit/debit
	go func() {
		userId := obj["userId"]
		// index the data
		indexData(r, table, obj)

		// credit or debit their account
		if upvote {
			// TODO: transfer of credit?
			_, err := Client(r).Wallet.Credit(&wallet.CreditRequest{
				Id:        userId.(string),
				Amount:    1,
				Visible:   true,
				Reference: t.Id,
			})
			if err != nil {
				fmt.Println("Wallet credit failed:", err)
			}
		} else {
			// TODO: transfer of credit?
			_, err := Client(r).Wallet.Debit(&wallet.DebitRequest{
				Id:        userId.(string),
				Amount:    1,
				Visible:   true,
				Reference: t.Id,
			})
			if err != nil {
				fmt.Println("Wallet debit failed:", err)
			}
		}
	}()

	return nil
}

func indexData(r *http.Request, idx string, data map[string]interface{}) {
	_, err := Client(r).Search.Index(&search.IndexRequest{
		Data:  data,
		Index: idx,
	})
	if err != nil {
		fmt.Errorf("Failed to index %s: %v", idx, err)
	}
}

func isMod(userId, s string) bool {
	arr := strings.Split(s, ",")
	for _, v := range arr {
		if v == userId {
			return true
		}
	}
	return false
}

func VoteWrapper(upvote bool, isComment bool) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var t VoteRequest
		err := decoder.Decode(&t)
		if err != nil {
			respond(w, nil, err)
			return
		}
		err = vote(w, r, upvote, isComment, t)
		respond(w, nil, err)
	}
}

// Endpoints
func Checkin(w http.ResponseWriter, r *http.Request) {
	group := "#daily+check-in"

	rsp, err := Client(r).Cache.Get(&cache.GetRequest{
		Key: group,
	})
	if err == nil && len(rsp.Value) > 0 {
		http.Error(w, "Already run at "+rsp.Value, 500)
		return
	}

	// set a cache value
	_, err = Client(r).Cache.Set(&cache.SetRequest{
		Key:   group,
		Value: time.Now().String(),
		Ttl:   int64((time.Hour * 12).Seconds()),
	})
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// send the email
	err = emailUsers(
		r,
		"micro",
		"Daily check-in",
		fmt.Sprintf(`Hey 👋, <a href="%s/%s">check-in</a> and let us know what you're upto!`, URL(nil), group),
	)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func Notify(w http.ResponseWriter, r *http.Request) {
	rsp, err := Client(r).Cache.Get(&cache.GetRequest{
		Key: "notify",
	})
	if err == nil && len(rsp.Value) > 0 {
		http.Error(w, "Already run at "+rsp.Value, 500)
		return
	}

	// set a cache value
	_, err = Client(r).Cache.Set(&cache.SetRequest{
		Key:   "notify",
		Value: time.Now().String(),
		Ttl:   int64(120),
	})
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// TODO: send updates since last check
	// get all the notifications
	// group and send notifications
}

func Signup(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t SignupRequest
	err := decoder.Decode(&t)
	if err != nil {
		respond(w, err, err)
		return
	}

	_, err = Client(r).User.Read(&user.ReadRequest{
		Username: t.Username,
	})
	if err != nil {
		createRsp, err := Client(r).User.Create(&user.CreateRequest{
			Username: t.Username,
			Email:    t.Email,
			Password: t.Password,
		})
		if err != nil {
			respond(w, createRsp, err)
			return
		}

		// create a wallet for the user
		wRsp, err := Client(r).Wallet.Create(&wallet.CreateRequest{
			Id:   createRsp.Account.Id,
			Name: t.Username,
		})
		if err != nil {
			respond(w, wRsp, err)
			return
		}
	}

	logRsp, err := Client(r).User.Login(&user.LoginRequest{
		Username: t.Username,
		Password: t.Password,
	})

	respond(w, logRsp, err)
}

func Login(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t LoginRequest
	err := decoder.Decode(&t)
	if err != nil {
		respond(w, err, err)
		return
	}
	logRsp, err := Client(r).User.Login(&user.LoginRequest{
		Username: t.Username,
		Password: t.Password,
	})
	respond(w, logRsp, err)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t LogoutRequest
	err := decoder.Decode(&t)
	if err != nil {
		respond(w, err, err)
		return
	}
	logRsp, err := Client(r).User.Logout(&user.LogoutRequest{
		SessionId: t.SessionID,
	})
	respond(w, logRsp, err)
}

func ReadSession(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t ReadSessionRequest
	err := decoder.Decode(&t)
	if err != nil {
		fmt.Fprintf(w, fmt.Sprintf("%v", err.Error()))
	}

	// get the user session
	rsp, err := Client(r).User.ReadSession(&user.ReadSessionRequest{
		SessionId: t.SessionId,
	})
	if err != nil {
		respond(w, nil, err)
		return
	}

	// set session for response
	response := make(map[string]interface{})
	response["session"] = rsp.Session

	ch := make(chan error, 1)

	go func() {
		readRsp, err := Client(r).User.Read(&user.ReadRequest{
			Id: rsp.Session.UserId,
		})
		if err != nil {
			ch <- err
			return
		}

		response["account"] = readRsp.Account
		ch <- nil
	}()

	// read the account balance while the session is being read
	var balance int64
	// get the balance
	if bRsp, err := Client(r).Wallet.Balance(&wallet.BalanceRequest{
		Id: rsp.Session.UserId,
	}); err != nil {
		balance = int64(0)
	} else {
		balance = bRsp.Balance
	}

	if err := <-ch; err != nil {
		respond(w, nil, err)
		return
	}

	// set the balance
	response["balance"] = balance

	respond(w, response, nil)
}

func NewGroup(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t GroupRequest
	err := decoder.Decode(&t)
	if err != nil {
		respond(w, nil, err)
		return
	}
	if t.Group.Name == "" {
		respond(w, nil, fmt.Errorf("group name is required"))
		return
	}
	if len(t.Group.Name) > 50 {
		respond(w, nil, fmt.Errorf("group name is too long"))
		return
	}

	// check if the group exists
	req := &db.ReadRequest{
		Table: "groups",
		Limit: 1,
	}

	query := ""

	if t.Group.Name != "" {
		query += fmt.Sprintf("name == '%v'", t.Group.Name)
	}
	if query != "" {
		req.Query = query
	}
	if t.Group.Id != "" {
		req.Id = t.Group.Id
	}

	rsp, err := Client(r).Db.Read(req)
	if err == nil && len(rsp.Records) > 0 {
		respond(w, nil, fmt.Errorf("group %s already exists", t.Group.Name))
		return
	}

	if len(t.SessionID) == 0 {
		respond(w, nil, fmt.Errorf("not logged in"))
		return
	}

	var userID, userName string

	srsp, err := Client(r).User.ReadSession(&user.ReadSessionRequest{
		SessionId: t.SessionID,
	})
	if err != nil {
		respond(w, srsp, err)
		return
	}
	userID = srsp.Session.UserId
	readRsp, err := Client(r).User.Read(&user.ReadRequest{
		Id: userID,
	})
	if err != nil {
		respond(w, readRsp, err)
		return
	}
	if !readRsp.Account.Verified {
		respond(w, nil, fmt.Errorf("email not verified"))
		return
	}
	userName = readRsp.Account.Username

	// check if there are moderators
	// otherwise add the user as one
	if len(t.Group.Moderators) == 0 {
		t.Group.Moderators = []string{
			userName,
		}
	}

	// create the group
	crsp, err := Client(r).Db.Create(&db.CreateRequest{
		Table: "groups",
		Record: map[string]interface{}{
			"name":        t.Group.Name,
			"description": t.Group.Description,
			"moderators":  t.Group.Moderators,
			"created":     time.Now(),
		},
	})

	// sanitize the group name
	gg := strings.Replace(t.Group.Name, " ", "+", -1)

	// fire an update
	go emailUsers(
		r,
		userID,
		"New # just made",
		fmt.Sprintf(`Checkout <a href="%s/#%s">%s</a> - %s`,
			URL(r), gg, gg, t.Group.Description),
	)

	respond(w, crsp, err)
}

func NewPost(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t PostRequest
	err := decoder.Decode(&t)
	if err != nil {
		respond(w, nil, err)
		return
	}
	if t.Post.Group == "" || t.Post.Title == "" {
		respond(w, nil, fmt.Errorf("both title and group are required"))
		return
	}
	if t.Post.Url == "" && t.Post.Content == "" {
		respond(w, nil, fmt.Errorf("url or content required"))
		return
	}
	if len(t.Post.Title) > 200 || len(t.Post.Url) > 200 {
		respond(w, nil, fmt.Errorf("post url or title too long"))
		return
	}
	if len(t.Post.Group) > 50 {
		respond(w, nil, fmt.Errorf("post group too long"))
		return
	}
	if len(t.Post.Content) > 3000 {
		respond(w, nil, fmt.Errorf("post content too long"))
		return
	}

	if len(t.SessionID) == 0 {
		respond(w, nil, fmt.Errorf("not logged in"))
		return
	}

	var userID, userName string

	rsp, err := Client(r).User.ReadSession(&user.ReadSessionRequest{
		SessionId: t.SessionID,
	})
	if err != nil {
		respond(w, rsp, err)
		return
	}

	userID = rsp.Session.UserId
	readRsp, err := Client(r).User.Read(&user.ReadRequest{
		Id: userID,
	})
	if err != nil {
		respond(w, rsp, err)
		return
	}

	if !readRsp.Account.Verified {
		respond(w, nil, fmt.Errorf("email not verified"))
		return
	}
	userName = readRsp.Account.Username

	// check the group exists before posting
	if !groupExists(r, t.Post.Group) {
		respond(w, nil, fmt.Errorf("group does not exist"))
		return
	}

	p := map[string]interface{}{
		"userId":    userID,
		"username":  userName,
		"content":   t.Post.Content,
		"url":       t.Post.Url,
		"upvotes":   float64(0),
		"downvotes": float64(0),
		"score":     float64(0),
		"group":     t.Post.Group,
		"title":     t.Post.Title,
		"created":   time.Now(),
	}

	crsp, err := Client(r).Db.Create(&db.CreateRequest{
		Table:  "posts",
		Record: p,
	})

	// index the post
	go indexData(r, "posts", p)

	// fire an update
	go emailUsers(
		r,
		userID,
		"New post: "+t.Post.Title,
		fmt.Sprintf(`Checkout <a href="%s/#post=%s">%s</a> in #%s`,
			URL(r), crsp.Id, t.Post.Title, strings.Replace(t.Post.Group, " ", "+", -1)),
	)

	respond(w, crsp, err)
}

func NewComment(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t CommentRequest
	err := decoder.Decode(&t)
	if err != nil {
		respond(w, nil, err)
		return
	}

	if len(t.SessionID) == 0 {
		respond(w, nil, fmt.Errorf("not logged in"))
		return
	}

	var userID, userName string

	// get user if available
	rsp, err := Client(r).User.ReadSession(&user.ReadSessionRequest{
		SessionId: t.SessionID,
	})
	if err != nil {
		respond(w, rsp, err)
		return
	}
	userID = rsp.Session.UserId
	readRsp, err := Client(r).User.Read(&user.ReadRequest{
		Id: userID,
	})
	if err != nil {
		respond(w, rsp, err)
		return
	}

	if !readRsp.Account.Verified {
		respond(w, nil, fmt.Errorf("email not verified"))
		return
	}

	userName = readRsp.Account.Username

	if t.Comment.PostId == "" {
		respond(w, nil, fmt.Errorf("no post id"))
		return
	}

	// get post to update comment counter
	dbRsp, err := Client(r).Db.Read(&db.ReadRequest{
		Table: "posts",
		Id:    t.Comment.PostId,
	})
	if err != nil {
		respond(w, nil, err)
		return
	}
	if dbRsp == nil || len(dbRsp.Records) == 0 {
		respond(w, nil, fmt.Errorf("post not found"))
		return
	}
	if len(dbRsp.Records) > 1 {
		respond(w, nil, fmt.Errorf("multiple posts found"))
		return
	}

	// create comment
	c := map[string]interface{}{
		"userId":    userID,
		"username":  userName,
		"content":   t.Comment.Content,
		"parent":    t.Comment.Parent,
		"postId":    t.Comment.PostId,
		"upvotes":   float64(0),
		"downvotes": float64(0),
		"score":     float64(0),
		"created":   time.Now(),
	}

	_, err = Client(r).Db.Create(&db.CreateRequest{
		Table:  "comments",
		Record: c,
	})
	if err != nil {
		respond(w, nil, err)
		return
	}

	go indexData(r, "comments", c)

	post := dbRsp.Records[0]
	title := post["title"].(string)
	group := strings.Replace(post["group"].(string), " ", "+", -1)

	// fire an update
	go emailUsers(
		r,
		userID,
		"New comment on "+title,
		fmt.Sprintf(`Checkout a new comment on <a href="%s/#post=%s">%s</a> in #%s`,
			URL(r), post["id"].(string), title, group),
	)

	go func() {
		// update counter
		oldCount, ok := dbRsp.Records[0]["commentCount"].(float64)
		if !ok {
			oldCount = 0
		}
		oldCount++
		dbRsp.Records[0]["commentCount"] = oldCount
		_, err = Client(r).Db.Update(&db.UpdateRequest{
			Table:  "posts",
			Id:     t.Comment.PostId,
			Record: dbRsp.Records[0],
		})

		if err != nil {
			fmt.Printf("Error updating post comment count %s: %v\n", t.Comment.PostId, err)
		}
	}()

	respond(w, nil, nil)
}

func score(m map[string]interface{}) float64 {
	score, ok := m["score"].(float64)
	if !ok {
		return -10000
	}
	sign := float64(1)
	if score == 0 {
		sign = 0
	}
	if score < 0 {
		sign = -1
	}
	order := math.Log10(math.Max(math.Abs(score), 1))
	var created int64
	switch v := m["created"].(type) {
	case string:
		t, err := time.Parse(time.RFC3339, v)
		if err != nil {
			fmt.Println(err)
		}
		created = t.Unix()
	case float64:
		created = int64(v)
	case int64:
		created = v
	}

	seconds := created - 1134028003
	return sign*order + float64(seconds)/45000
}

func Groups(w http.ResponseWriter, r *http.Request) {
	var t GroupsRequest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&t)
	req := &db.ReadRequest{
		Table:   "groups",
		Order:   "asc",
		OrderBy: "name",
		Limit:   1000,
	}
	query := ""

	if t.Name != "" {
		query += fmt.Sprintf("name == '%v'", t.Name)
	}
	if query != "" {
		req.Query = query
	}
	if t.Id != "" {
		req.Id = t.Id
	}
	if t.Limit > 0 {
		req.Limit = t.Limit
	}

	rsp, err := Client(r).Db.Read(req)

	sort.Slice(rsp.Records, func(i, j int) bool {
		return score(rsp.Records[i]) > score(rsp.Records[j])
	})

	respond(w, rsp, err)
}

func Posts(w http.ResponseWriter, r *http.Request) {
	var t PostsRequest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&t)
	req := &db.ReadRequest{
		Table:   "posts",
		Order:   "desc",
		OrderBy: "created",
		Limit:   1000,
	}
	query := ""

	// @TODO this should be != 0 but that causes an empty new page
	if t.Min > 0 {
		query += "score >= " + fmt.Sprintf("%v", t.Min)
	}
	if t.Max > 0 {
		if query != "" {
			query += " and "
		}
		query += "score <= " + fmt.Sprintf("%v", t.Max)
	}
	if t.Group != "all" && t.Group != "" {
		if query != "" {
			query += " and "
		}
		query += fmt.Sprintf("group == '%v'", t.Group)
	}
	if query != "" {
		req.Query = query
	}
	if t.Id != "" {
		req.Id = t.Id
	}

	rsp, err := Client(r).Db.Read(req)
	sort.Slice(rsp.Records, func(i, j int) bool {
		return score(rsp.Records[i]) > score(rsp.Records[j])
	})
	respond(w, rsp, err)
}

func Comments(w http.ResponseWriter, r *http.Request) {
	var t CommentsRequest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&t)
	if err != nil {
		fmt.Fprintf(w, fmt.Sprintf("%v", err.Error()))
	}
	rsp, err := Client(r).Db.Read(&db.ReadRequest{
		Table:   "comments",
		Order:   "desc",
		Query:   "postId == '" + t.PostId + "'",
		OrderBy: "created",
	})
	sort.Slice(rsp.Records, func(i, j int) bool {
		return score(rsp.Records[i]) > score(rsp.Records[j])
	})
	respond(w, rsp, err)
}

func Settings(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t SettingsRequest
	err := decoder.Decode(&t)
	if err != nil {
		respond(w, nil, err)
		return
	}

	if len(t.SessionID) == 0 {
		respond(w, nil, fmt.Errorf("not logged in"))
		return
	}

	// get user if available
	rsp, err := Client(r).User.ReadSession(&user.ReadSessionRequest{
		SessionId: t.SessionID,
	})
	if err != nil {
		respond(w, rsp, err)
		return
	}

	// get user id from session
	userID := rsp.Session.UserId

	// check for existing settings
	readRsp, err := Client(r).Db.Read(&db.ReadRequest{
		Table: "settings",
		Query: "userId == '" + userID + "'",
		Limit: 1,
	})
	if err != nil {
		respond(w, readRsp, err)
		return
	}

	var settings map[string]interface{}
	if len(readRsp.Records) > 0 {
		settings = readRsp.Records[0]
	}

	// return current settings
	if t.Settings == nil {
		respond(w, settings, nil)
		return
	}

	// create new settings
	if settings == nil {
		if t.Settings == nil {
			respond(w, nil, fmt.Errorf("missing settings"))
			return
		}

		t.Settings["userId"] = userID

		createRsp, err := Client(r).Db.Create(&db.CreateRequest{
			Table:  "settings",
			Record: t.Settings,
		})

		respond(w, createRsp, err)
		return
	}

	// update settings
	settings = t.Settings
	// ensure we use the same record id
	settings["id"] = readRsp.Records[0]["id"].(string)
	// ensure we have the same user
	settings["userId"] = userID

	// store the update
	updateRsp, err := Client(r).Db.Update(&db.UpdateRequest{
		Table:  "settings",
		Id:     settings["id"].(string),
		Record: settings,
	})

	respond(w, updateRsp, err)
}

func Users(w http.ResponseWriter, r *http.Request) {
	// read the user
	var t UsersRequest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&t)
	if err != nil {
		fmt.Fprintf(w, fmt.Sprintf("%v", err.Error()))
	}
	if len(t.Id) == 0 && len(t.Username) == 0 {
		respond(w, nil, fmt.Errorf("missing username and id"))
		return
	}

	// get the account
	rsp, err := Client(r).User.Read(&user.ReadRequest{Id: t.Id, Username: t.Username})
	if err != nil {
		respond(w, nil, err)
		return
	}
	var balance int64
	// get the balance
	bRsp, err := Client(r).Wallet.Balance(&wallet.BalanceRequest{
		Id: t.Id,
	})
	if err != nil {
		balance = int64(0)
	} else {
		balance = bRsp.Balance
	}
	respond(w, &User{
		Id:       t.Id,
		Username: rsp.Account.Username,
		Email:    rsp.Account.Email,
		Balance:  balance,
	}, nil)
}

func VerifyAccount(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var t SettingsRequest
	err := decoder.Decode(&t)
	if err != nil {
		respond(w, nil, err)
		return
	}

	if len(t.SessionID) == 0 {
		respond(w, nil, fmt.Errorf("not logged in"))
		return
	}

	// get user if available
	rsp, err := Client(r).User.ReadSession(&user.ReadSessionRequest{
		SessionId: t.SessionID,
	})
	if err != nil {
		respond(w, rsp, err)
		return
	}

	// get user id from session
	userID := rsp.Session.UserId

	readRsp, err := Client(r).User.Read(&user.ReadRequest{
		Id: userID,
	})
	if err != nil {
		respond(w, readRsp, err)
		return
	}

	// send verification email
	emailRsp, err := Client(r).User.SendVerificationEmail(&user.SendVerificationEmailRequest{
		Email:       readRsp.Account.Email,
		FromName:    "M3O",
		Subject:     "Verify M3O user account",
		RedirectUrl: URL(r) + "/#account",
		TextContent: "Click the following link to verify your M3O user account\n\n$micro_verification_link",
	})

	respond(w, emailRsp, err)
}

// Utils

func Cors(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return true
	}

	if v := r.Header.Get("Content-Type"); strings.Contains(v, "application/json") {
		w.Header().Set("Content-Type", "application/json")
	}

	return false
}

func respond(w http.ResponseWriter, i interface{}, err error) {
	if err != nil {
		w.WriteHeader(500)
		fmt.Println(err)
	}
	if i == nil {
		i = map[string]interface{}{}
	}
	if err != nil {
		i = map[string]interface{}{
			"error": err.Error(),
		}
	}
	bs, _ := json.Marshal(i)
	fmt.Fprintf(w, fmt.Sprintf("%v", string(bs)))
}

// Register the api routes
func Register(mux *http.ServeMux) {
	mux.HandleFunc("/api/upvotePost", VoteWrapper(true, false))
	mux.HandleFunc("/api/downvotePost", VoteWrapper(false, false))
	mux.HandleFunc("/api/upvoteComment", VoteWrapper(true, true))
	mux.HandleFunc("/api/downvoteComment", VoteWrapper(false, true))
	mux.HandleFunc("/api/checkin", Checkin)
	mux.HandleFunc("/api/notify", Notify)
	mux.HandleFunc("/api/email", Email)
	mux.HandleFunc("/api/group", NewGroup)
	mux.HandleFunc("/api/post", NewPost)
	mux.HandleFunc("/api/comment", NewComment)
	mux.HandleFunc("/api/groups", Groups)
	mux.HandleFunc("/api/posts", Posts)
	mux.HandleFunc("/api/comments", Comments)
	mux.HandleFunc("/api/login", Login)
	mux.HandleFunc("/api/logout", Logout)
	mux.HandleFunc("/api/signup", Signup)
	mux.HandleFunc("/api/settings", Settings)
	mux.HandleFunc("/api/readSession", ReadSession)
	mux.HandleFunc("/api/verifyAccount", VerifyAccount)
	mux.HandleFunc("/api/users", Users)
}
