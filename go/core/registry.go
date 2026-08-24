package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewDatabaseEntityFunc func(client *NotionSDK, entopts map[string]any) NotionEntity

var NewPageEntityFunc func(client *NotionSDK, entopts map[string]any) NotionEntity

