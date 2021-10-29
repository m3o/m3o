import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Account, Session } from 'm3o/user';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';

interface PostRequest {
  post: Post;
  sessionID?: string;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  created: string;
  upvotes: number;
  downvotes: number;
  score: number;
  title?: string;
  url?: string;
  sub: string;
  commentCount: number;

  //
  expanded: boolean;
  comments?: Comment[];
}

interface PostsResponse {
  records: Post[];
}

interface LoginResponse {
  session: Session;
}

interface ReadSessionResponse {
  session: Session;
  account: Account;
}

interface Comment {
  id: string;
  content?: string;
  parent?: string;
  upvotes: number;
  downvotes: number;
  score: number;
  postId?: number;
  userName?: string;
  userId?: string;
  created: string;
}

interface VoteRequest {
  sessionId: string;
  id: string;
}

interface CommentRequest {
  sessionId?: string;
  comment: Comment;
}

interface CommentsResponse {
  records: Comment[];
}

interface Scorable {
  id: string;
  upvotes: number;
  downvotes: number;
  score: number;
}

const hotScoreMin = 2;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'reddit';
  post: Post = {} as Post;
  posts: Post[] = [];
  username = '';
  password = '';
  userID = '';
  comment = '';
  sub = 'all';
  hotScoreMin = hotScoreMin;
  min: number = hotScoreMin;
  max: number = 0;
  hot = true;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private toastr: ToastrService
  ) {
    this.load();
    this.loadUser();
  }

  loadUser() {
    if (this.cookie.get('token')) {
      this.http
        .post<ReadSessionResponse>(environment.url + '/readSession', {
          sessionId: this.cookie.get('token'),
        })
        .toPromise()
        .then((rsp) => {
          this.username = rsp.account.username as string;
          this.userID = rsp.account.id as string;
        });
    }
  }

  switchToHot(): boolean {
    this.hot = true;
    this.min = this.hotScoreMin;
    this.max = 0;
    this.load();
    return false;
  }

  switchToNew(): boolean {
    this.hot = false;
    this.min = -20;
    this.max = this.hotScoreMin - 1;
    this.load();
    return false;
  }

  submit() {
    this.http
      .post(environment.url + '/post', {
        post: this.post,
        sessionId: this.cookie.get('token'),
      })
      .toPromise()
      .then((rsp) => {
        this.switchToNew();
      })
      .catch((e) => {
        console.log(e);
        this.toastr.error(e.error?.error);
      });
  }

  load() {
    let req = {
      min: this.min,
      max: this.max,
      sub: this.sub,
    };
    this.http
      .post<PostsResponse>(environment.url + '/posts', req)
      .toPromise()
      .then((rsp) => {
        this.posts = rsp.records;
        console.log(typeof rsp);
      })
      .catch((e) => {
        console.log(e);
        this.toastr.error(e.error?.error);
      });
  }

  login() {
    this.http
      .post<LoginResponse>(environment.url + '/login', {
        username: this.username,
        password: this.password,
      })
      .toPromise()
      .then((rsp) => {
        this.cookie.set('token', rsp.session.id ? rsp.session.id : '', 30, '/');
        this.loadUser();
      })
      .catch((e) => {
        console.log(e);
        this.toastr.error(e.error?.error);
      });
  }

  vote(p: Scorable, post: boolean, upvote: boolean) {
    if (!this.cookie.get('token')) {
      this.toastr.error('log in to vote');
    }
    let action = 'upvote';
    if (!upvote) {
      action = 'downvote';
    }
    let table = 'Post';
    if (!post) {
      table = 'Comment';
    }
    this.http
      .post(environment.url + '/' + action + table, {
        sessionId: this.cookie.get('token'),
        id: p.id,
      })
      .toPromise()
      .then((rsp) => {
        if (!p.upvotes) {
          p.upvotes = 0;
        }
        if (!p.downvotes) {
          p.downvotes = 0;
        }
        upvote ? p.upvotes++ : p.downvotes++;
        p.score = p.upvotes - p.downvotes;
      })
      .catch((e) => {
        console.log(e);
        this.toastr.error(e.error?.error);
      });
  }

  reveal(p: Post): boolean {
    if (!p.expanded) {
      this.loadComments(p);
    }
    p.expanded = !p.expanded;
    return false;
  }

  loadComments(p: Post) {
    this.http
      .post<CommentsResponse>(environment.url + '/comments', {
        postId: p.id,
      })
      .toPromise()
      .then((rsp) => {
        p.comments = rsp.records;
      })
      .catch((e) => {
        console.log(e);
        this.toastr.error(e.error?.error);
      });
  }

  filterSub(sub: string):boolean {
    this.sub = sub;
    this.load();
    return false
  }

  submitComment(p: Post) {
    this.http
      .post(environment.url + '/comment', {
        comment: {
          content: this.comment,
          postId: p.id,
        },
        sessionId: this.cookie.get('token'),
      })
      .toPromise()
      .then((rsp) => {
        this.loadComments(p);
      })
      .catch((e) => {
        console.log(e);
        this.toastr.error(e.error?.error);
      });
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  logout() {
    this.cookie.set('token', '', 30, '/');
    this.userID = '';
    this.username = '';
  }
}
