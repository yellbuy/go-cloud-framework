package utils

import (
	"strings"
	"time"

	cache "github.com/patrickmn/go-cache"
)

var Cache *cache.Cache

const (
	// 应用授权缓存Key
	CacheKeyBaseAppById string = "base_app_id_%v_"
	// 商户缓存Key
	CacheKeyBaseTenantById string = "base_tenant_id_%v_"
	// 用户信息授权缓存Key
	CacheKeyBaseUserById string = "base_user_uid_%v_"
	// 用户授权缓存Key
	CacheKeyBaseUserAuthByUid string = "base_user_auth_uid_%v_"
	// 用户的权限缓存
	CacheKeyBasePermissionByKindUid string = "base_permission_tree_kind_%v_uid_%v_"
	// 用户的菜单权限缓存
	CacheKeyBasePermissionMdlByKindKeyUid string = "base_permission_tree_nav_kind_%v_rootkey_%v_uid_%v_"
	// 全局权限缓存
	CacheKeyBasePermissionFileByKind string = "base_permission_file_kind_%v_"

	// 应用授权缓存Key
	CacheKeyCommonUeditorConfig string = "common_editor_ueditor_config_"

	// 数据库设置缓存
	CacheKeyCommonSettingDbByAppidTidUid = "common_setting_db_%v_%v_%v_"
	// 文件设置缓存
	CacheKeyCommonSettingFileByKind = "common_setting_file_%v_"

	// 广告缓存
	CacheKeyEshopAdByKindScopeids = "eshop_ad_kind_%v_scopeids_%v_"

	// 统计缓存
	CacheKeyCommonStatisticsValues = "common_statistics_values_%+v_"
	// 区域缓存
	CacheKeyCommonAreaById                  = "common_area_id_%v_"
	CacheKeyCommonAreaTreeByPidAndMaxLevel  = "common_area_tree_pid_%v_maxLevel_%v_"
	CacheKeyCommonAreaGroupByPidAndMaxLevel = "common_area_group_pid_%v_maxLevel_%v_"

	// 默认永久缓存
	DefaultExpiration time.Duration = cache.DefaultExpiration
	// 十分钟缓存
	TenMinuteExpiration time.Duration = 10 * time.Minute
	// 5分钟缓存
	FileMinuteExpiration time.Duration = 5 * time.Minute
)

type LoadDataCallback func() (interface{}, error)

// 获取缓存
func GetCache(cacheKey string, callback LoadDataCallback, expirationTime ...time.Duration) (interface{}, error) {
	res, hasCache := Cache.Get(cacheKey)
	if hasCache {
		return res, nil
	}
	res, err := callback()
	if err == nil && res != nil {
		expiration := DefaultExpiration
		if len(expirationTime) > 0 {
			expiration = expirationTime[0]
		}
		// 设置缓存
		Cache.Set(cacheKey, res, expiration)
	}
	return res, err
}

// 通过key前缀批量删除缓存
func DeleteCacheByPrefix(prefix string) {
	items := Cache.Items()
	for key := range items {
		if strings.HasPrefix(key, prefix) {
			Cache.Delete(key)
		}
	}
}
