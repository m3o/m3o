package handler

import (
	"context"
	"encoding/json"
	"fmt"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/errors"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	billing "m3o.dev/api/billing/proto"
	auth2 "m3o.dev/api/pkg/auth"
	projects "m3o.dev/api/projects/proto"
)

const (
	prefixProjectsByUser           = "projectsByUser"
	prefixProjectsByID             = "projectsByID"
	prefixProjectsByBillingAccount = "projectsByBilling"

	roleAdmin = "admin"
)

// pass a blank projectID for listing projects by userID
func projectsByUserKey(userID, projectID string) string {
	return fmt.Sprintf("%s/%s/%s", prefixProjectsByUser, userID, projectID)
}

func projectsByID(projectID string) string {
	return fmt.Sprintf("%s/%s", prefixProjectsByID, projectID)
}

func projectsByBilling(billingAccID, projectID string) string {
	return fmt.Sprintf("%s/%s/%s", prefixProjectsByBillingAccount, billingAccID, projectID)
}

type Project struct {
	ID               string
	Name             string
	Members          []Member
	BillingAccountID string
}

type Member struct {
	ID    string
	Roles []string
}

type Projects struct {
	billingSvc billing.BillingService
}

func New(srv *service.Service) *Projects {
	return &Projects{
		billingSvc: billing.NewBillingService("billing", srv.Client()),
	}
}

func (p *Projects) Create(ctx context.Context, request *projects.CreateRequest, response *projects.CreateResponse) error {
	panic("implement me")
}

func (p *Projects) Read(ctx context.Context, request *projects.ReadRequest, response *projects.ReadResponse) error {
	method := "projects.Read"
	acc, err := auth2.VerifyMicroCustomer(ctx, method)
	if err != nil {
		return err
	}
	if len(request.Id) == 0 {
		return errors.BadRequest(method, "Missing ID param")
	}
	recs, err := store.Read(projectsByID(request.Id))
	if err != nil && err != store.ErrNotFound {
		log.Errorf("Error reading project %s", err)
		return errors.InternalServerError(method, "Error reading project")
	}
	if len(recs) == 0 {
		return errors.NotFound(method, "Project not found")
	}
	var project Project
	if err := json.Unmarshal(recs[0].Value, &project); err != nil {
		log.Errorf("Error reading project %s", err)
		return errors.InternalServerError(method, "Error reading project")
	}
	found := false
	for _, v := range project.Members {
		if v.ID == acc.ID {
			found = true
			break
		}
	}
	if !found {
		return errors.Unauthorized(method, "Unauthorized")
	}
	response.Project = projectToProto(&project)
	return nil
}

func createDefaultProject(userID string) (*Project, error) {
	project := Project{
		ID:   userID,
		Name: "default",
		Members: []Member{
			{
				ID:    userID,
				Roles: []string{roleAdmin},
			},
		},
		BillingAccountID: userID,
	}

	err := writeProject(project)
	return &project, err
}

func writeProject(project Project) error {
	// delete any existing members
	recs, err := store.Read(projectsByID(project.ID))
	if err != nil && err != store.ErrNotFound {
		return err
	}
	if len(recs) == 1 {
		var proj Project
		if err := json.Unmarshal(recs[0].Value, &proj); err != nil {
			return err
		}
		for _, v := range proj.Members {
			if err := store.Delete(projectsByUserKey(v.ID, proj.ID)); err != nil {
				return err
			}
		}
	}
	// write it

	for _, v := range project.Members {
		if err := store.Write(store.NewRecord(projectsByUserKey(v.ID, project.ID), project)); err != nil {
			return err
		}
	}
	if err := store.Write(store.NewRecord(projectsByID(project.ID), project)); err != nil {
		return err
	}
	if err := store.Write(store.NewRecord(projectsByBilling(project.BillingAccountID, project.ID), project)); err != nil {
		return err
	}
	return nil
}

// List the projects this user has access to or list the projects for this billing account
func (p *Projects) List(ctx context.Context, request *projects.ListRequest, response *projects.ListResponse) error {
	method := "projects.List"
	acc, err := auth2.VerifyMicroCustomer(ctx, method)
	if err != nil {
		return err
	}
	key := projectsByUserKey(acc.ID, "")
	if len(request.BillingAccountId) > 0 {
		// Check the customer has admin access to this billing accountn
		rsp, err := p.billingSvc.ReadAccount(ctx, &billing.ReadAccountRequest{Id: request.BillingAccountId})
		if err != nil || rsp.BillingAccount == nil {
			return errors.Unauthorized(method, "Unauthorized")
		}
		found := false
		for _, v := range rsp.BillingAccount.Admins {
			if v == acc.ID {
				found = true
				break
			}
		}
		if !found {
			return errors.Unauthorized(method, "Unauthorized")
		}
		key = projectsByBilling(request.BillingAccountId, "")

	}

	recs, err := store.Read(key, store.ReadPrefix())
	if err != nil && err != store.ErrNotFound {
		log.Errorf("Error listing projects %s", err)
		return errors.InternalServerError(method, "Error looking up projects")
	}
	if len(recs) == 0 {
		// lazy create
		proj, err := createDefaultProject(acc.ID)
		if err != nil {
			log.Errorf("Error creating default project %s", err)
			return errors.InternalServerError(method, "Error looking up projects")
		}
		response.Projects = []*projects.Project{projectToProto(proj)}
		return nil
	}
	response.Projects = make([]*projects.Project, len(recs))
	for i, v := range recs {
		var proj Project
		if err := json.Unmarshal(v.Value, &proj); err != nil {
			log.Errorf("Error marshalling project %s", err)
			return errors.InternalServerError(method, "Error looking up projects")
		}
		response.Projects[i] = projectToProto(&proj)
	}
	return nil
}

func projectToProto(proj *Project) *projects.Project {
	members := []*projects.Member{}
	for _, v := range proj.Members {
		members = append(members, &projects.Member{
			Id:    v.ID,
			Roles: v.Roles,
		})
	}
	return &projects.Project{
		Id:      proj.ID,
		Name:    proj.Name,
		Members: members,
	}
}
