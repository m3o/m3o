package domain

import (
	"sync"

	user "m3o.dev/services/user/proto"
)

var (
	mtx      sync.RWMutex
	sessions = map[string]*user.Session{}
)
