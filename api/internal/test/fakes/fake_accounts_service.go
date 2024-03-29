// Code generated by counterfeiter. DO NOT EDIT.
package fakes

import (
	"context"
	"sync"

	"m3o.dev/platform/proto/auth"
	"m3o.dev/platform/service/client"
)

type FakeAccountsService struct {
	ChangeSecretStub        func(context.Context, *auth.ChangeSecretRequest, ...client.CallOption) (*auth.ChangeSecretResponse, error)
	changeSecretMutex       sync.RWMutex
	changeSecretArgsForCall []struct {
		arg1 context.Context
		arg2 *auth.ChangeSecretRequest
		arg3 []client.CallOption
	}
	changeSecretReturns struct {
		result1 *auth.ChangeSecretResponse
		result2 error
	}
	changeSecretReturnsOnCall map[int]struct {
		result1 *auth.ChangeSecretResponse
		result2 error
	}
	DeleteStub        func(context.Context, *auth.DeleteAccountRequest, ...client.CallOption) (*auth.DeleteAccountResponse, error)
	deleteMutex       sync.RWMutex
	deleteArgsForCall []struct {
		arg1 context.Context
		arg2 *auth.DeleteAccountRequest
		arg3 []client.CallOption
	}
	deleteReturns struct {
		result1 *auth.DeleteAccountResponse
		result2 error
	}
	deleteReturnsOnCall map[int]struct {
		result1 *auth.DeleteAccountResponse
		result2 error
	}
	ListStub        func(context.Context, *auth.ListAccountsRequest, ...client.CallOption) (*auth.ListAccountsResponse, error)
	listMutex       sync.RWMutex
	listArgsForCall []struct {
		arg1 context.Context
		arg2 *auth.ListAccountsRequest
		arg3 []client.CallOption
	}
	listReturns struct {
		result1 *auth.ListAccountsResponse
		result2 error
	}
	listReturnsOnCall map[int]struct {
		result1 *auth.ListAccountsResponse
		result2 error
	}
	invocations      map[string][][]interface{}
	invocationsMutex sync.RWMutex
}

func (fake *FakeAccountsService) ChangeSecret(arg1 context.Context, arg2 *auth.ChangeSecretRequest, arg3 ...client.CallOption) (*auth.ChangeSecretResponse, error) {
	fake.changeSecretMutex.Lock()
	ret, specificReturn := fake.changeSecretReturnsOnCall[len(fake.changeSecretArgsForCall)]
	fake.changeSecretArgsForCall = append(fake.changeSecretArgsForCall, struct {
		arg1 context.Context
		arg2 *auth.ChangeSecretRequest
		arg3 []client.CallOption
	}{arg1, arg2, arg3})
	stub := fake.ChangeSecretStub
	fakeReturns := fake.changeSecretReturns
	fake.recordInvocation("ChangeSecret", []interface{}{arg1, arg2, arg3})
	fake.changeSecretMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2, arg3...)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeAccountsService) ChangeSecretCallCount() int {
	fake.changeSecretMutex.RLock()
	defer fake.changeSecretMutex.RUnlock()
	return len(fake.changeSecretArgsForCall)
}

func (fake *FakeAccountsService) ChangeSecretCalls(stub func(context.Context, *auth.ChangeSecretRequest, ...client.CallOption) (*auth.ChangeSecretResponse, error)) {
	fake.changeSecretMutex.Lock()
	defer fake.changeSecretMutex.Unlock()
	fake.ChangeSecretStub = stub
}

func (fake *FakeAccountsService) ChangeSecretArgsForCall(i int) (context.Context, *auth.ChangeSecretRequest, []client.CallOption) {
	fake.changeSecretMutex.RLock()
	defer fake.changeSecretMutex.RUnlock()
	argsForCall := fake.changeSecretArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2, argsForCall.arg3
}

func (fake *FakeAccountsService) ChangeSecretReturns(result1 *auth.ChangeSecretResponse, result2 error) {
	fake.changeSecretMutex.Lock()
	defer fake.changeSecretMutex.Unlock()
	fake.ChangeSecretStub = nil
	fake.changeSecretReturns = struct {
		result1 *auth.ChangeSecretResponse
		result2 error
	}{result1, result2}
}

func (fake *FakeAccountsService) ChangeSecretReturnsOnCall(i int, result1 *auth.ChangeSecretResponse, result2 error) {
	fake.changeSecretMutex.Lock()
	defer fake.changeSecretMutex.Unlock()
	fake.ChangeSecretStub = nil
	if fake.changeSecretReturnsOnCall == nil {
		fake.changeSecretReturnsOnCall = make(map[int]struct {
			result1 *auth.ChangeSecretResponse
			result2 error
		})
	}
	fake.changeSecretReturnsOnCall[i] = struct {
		result1 *auth.ChangeSecretResponse
		result2 error
	}{result1, result2}
}

func (fake *FakeAccountsService) Delete(arg1 context.Context, arg2 *auth.DeleteAccountRequest, arg3 ...client.CallOption) (*auth.DeleteAccountResponse, error) {
	fake.deleteMutex.Lock()
	ret, specificReturn := fake.deleteReturnsOnCall[len(fake.deleteArgsForCall)]
	fake.deleteArgsForCall = append(fake.deleteArgsForCall, struct {
		arg1 context.Context
		arg2 *auth.DeleteAccountRequest
		arg3 []client.CallOption
	}{arg1, arg2, arg3})
	stub := fake.DeleteStub
	fakeReturns := fake.deleteReturns
	fake.recordInvocation("Delete", []interface{}{arg1, arg2, arg3})
	fake.deleteMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2, arg3...)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeAccountsService) DeleteCallCount() int {
	fake.deleteMutex.RLock()
	defer fake.deleteMutex.RUnlock()
	return len(fake.deleteArgsForCall)
}

func (fake *FakeAccountsService) DeleteCalls(stub func(context.Context, *auth.DeleteAccountRequest, ...client.CallOption) (*auth.DeleteAccountResponse, error)) {
	fake.deleteMutex.Lock()
	defer fake.deleteMutex.Unlock()
	fake.DeleteStub = stub
}

func (fake *FakeAccountsService) DeleteArgsForCall(i int) (context.Context, *auth.DeleteAccountRequest, []client.CallOption) {
	fake.deleteMutex.RLock()
	defer fake.deleteMutex.RUnlock()
	argsForCall := fake.deleteArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2, argsForCall.arg3
}

func (fake *FakeAccountsService) DeleteReturns(result1 *auth.DeleteAccountResponse, result2 error) {
	fake.deleteMutex.Lock()
	defer fake.deleteMutex.Unlock()
	fake.DeleteStub = nil
	fake.deleteReturns = struct {
		result1 *auth.DeleteAccountResponse
		result2 error
	}{result1, result2}
}

func (fake *FakeAccountsService) DeleteReturnsOnCall(i int, result1 *auth.DeleteAccountResponse, result2 error) {
	fake.deleteMutex.Lock()
	defer fake.deleteMutex.Unlock()
	fake.DeleteStub = nil
	if fake.deleteReturnsOnCall == nil {
		fake.deleteReturnsOnCall = make(map[int]struct {
			result1 *auth.DeleteAccountResponse
			result2 error
		})
	}
	fake.deleteReturnsOnCall[i] = struct {
		result1 *auth.DeleteAccountResponse
		result2 error
	}{result1, result2}
}

func (fake *FakeAccountsService) List(arg1 context.Context, arg2 *auth.ListAccountsRequest, arg3 ...client.CallOption) (*auth.ListAccountsResponse, error) {
	fake.listMutex.Lock()
	ret, specificReturn := fake.listReturnsOnCall[len(fake.listArgsForCall)]
	fake.listArgsForCall = append(fake.listArgsForCall, struct {
		arg1 context.Context
		arg2 *auth.ListAccountsRequest
		arg3 []client.CallOption
	}{arg1, arg2, arg3})
	stub := fake.ListStub
	fakeReturns := fake.listReturns
	fake.recordInvocation("List", []interface{}{arg1, arg2, arg3})
	fake.listMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2, arg3...)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeAccountsService) ListCallCount() int {
	fake.listMutex.RLock()
	defer fake.listMutex.RUnlock()
	return len(fake.listArgsForCall)
}

func (fake *FakeAccountsService) ListCalls(stub func(context.Context, *auth.ListAccountsRequest, ...client.CallOption) (*auth.ListAccountsResponse, error)) {
	fake.listMutex.Lock()
	defer fake.listMutex.Unlock()
	fake.ListStub = stub
}

func (fake *FakeAccountsService) ListArgsForCall(i int) (context.Context, *auth.ListAccountsRequest, []client.CallOption) {
	fake.listMutex.RLock()
	defer fake.listMutex.RUnlock()
	argsForCall := fake.listArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2, argsForCall.arg3
}

func (fake *FakeAccountsService) ListReturns(result1 *auth.ListAccountsResponse, result2 error) {
	fake.listMutex.Lock()
	defer fake.listMutex.Unlock()
	fake.ListStub = nil
	fake.listReturns = struct {
		result1 *auth.ListAccountsResponse
		result2 error
	}{result1, result2}
}

func (fake *FakeAccountsService) ListReturnsOnCall(i int, result1 *auth.ListAccountsResponse, result2 error) {
	fake.listMutex.Lock()
	defer fake.listMutex.Unlock()
	fake.ListStub = nil
	if fake.listReturnsOnCall == nil {
		fake.listReturnsOnCall = make(map[int]struct {
			result1 *auth.ListAccountsResponse
			result2 error
		})
	}
	fake.listReturnsOnCall[i] = struct {
		result1 *auth.ListAccountsResponse
		result2 error
	}{result1, result2}
}

func (fake *FakeAccountsService) Invocations() map[string][][]interface{} {
	fake.invocationsMutex.RLock()
	defer fake.invocationsMutex.RUnlock()
	fake.changeSecretMutex.RLock()
	defer fake.changeSecretMutex.RUnlock()
	fake.deleteMutex.RLock()
	defer fake.deleteMutex.RUnlock()
	fake.listMutex.RLock()
	defer fake.listMutex.RUnlock()
	copiedInvocations := map[string][][]interface{}{}
	for key, value := range fake.invocations {
		copiedInvocations[key] = value
	}
	return copiedInvocations
}

func (fake *FakeAccountsService) recordInvocation(key string, args []interface{}) {
	fake.invocationsMutex.Lock()
	defer fake.invocationsMutex.Unlock()
	if fake.invocations == nil {
		fake.invocations = map[string][][]interface{}{}
	}
	if fake.invocations[key] == nil {
		fake.invocations[key] = [][]interface{}{}
	}
	fake.invocations[key] = append(fake.invocations[key], args)
}

var _ auth.AccountsService = new(FakeAccountsService)
