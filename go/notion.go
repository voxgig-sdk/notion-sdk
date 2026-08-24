package voxgignotionsdk

import (
	"github.com/voxgig-sdk/notion-sdk/go/core"
	"github.com/voxgig-sdk/notion-sdk/go/entity"
	"github.com/voxgig-sdk/notion-sdk/go/feature"
	_ "github.com/voxgig-sdk/notion-sdk/go/utility"
)

// Type aliases preserve external API.
type NotionSDK = core.NotionSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type NotionEntity = core.NotionEntity
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type NotionError = core.NotionError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewDatabaseEntityFunc = func(client *core.NotionSDK, entopts map[string]any) core.NotionEntity {
		return entity.NewDatabaseEntity(client, entopts)
	}
	core.NewPageEntityFunc = func(client *core.NotionSDK, entopts map[string]any) core.NotionEntity {
		return entity.NewPageEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewNotionSDK = core.NewNotionSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var SharedConfig = core.SharedConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewNotionSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *NotionSDK  { return NewNotionSDK(nil) }
func Test() *NotionSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewTestFeature = feature.NewTestFeature
