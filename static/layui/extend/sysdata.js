/**
 * 数据存储
 * https://gitee.com/sesamekim/sysdata
 * @author wangjianghai
 * @date 2018/8/7 9:03
 */
layui.define(function (exports) {

    var keyPrefix = "data_save_key_";
    var paramKey = "param"; // 参数的key
    var resultKey = "result"; // 结果的key
    var objKey = "obj"; // 结果的key

    var obj = {
        /**
         * 生成一个数据保存的key
         * @param params : json 格式的参数
         * -----------------------------------------------------
         * prefix : key的前缀, 可为空,一般不做修改, 默认 data_save_key_
         * -----------------------------------------------------
         * @returns 返回生成的key
         */
        createKey: function (params) {
            return sysCreateKey(params);
        }
        /**
         * 保存数据的方法
         * @param params : json 格式的参数
         * ----------------------------------------
         * key : 参数保存的key, 可不填,会自动生成一个, 根据实际情况决定, 有的需要事先生成key
         * type : 数据的保存方式,默认1 , 1 : 页面关闭后即失效 ( layui.sessionData ) , 2 : 数据会永久存在，除非物理删除 ( layui.data )
         * data : 要保存的数据, json格式, 定义了三个参数 , { param:{}, result:{}, obj:{}}
         * **********  param : 参数, result : 结果, obj ,其他数据
         * -------------------------------------------------
         * @returns 返回key
         */
        , saveData: function (params) {
            return sysSaveData(params);
        }
        /**
         * 保存数据的方法, 直接保存到 param
         * @param params : json 格式的参数,
         * ----------------------------------------
         * 参数和 saveData 一样,  不同的是 data
         * data : 数据会被处理, 就是param 的数据
         * -------------------------------------------------
         * @returns 返回key
         */
        , saveDataParam: function (params) {
            return sysSaveDataType(params,"param");
        }
        /**
         * 保存数据的方法, 直接保存到 result
         * @param params : json 格式的参数,
         * ----------------------------------------
         * 参数和 saveData 一样,  不同的是 data
         * data : 数据会被处理, 就是result 的数据
         * -------------------------------------------------
         * @returns 返回key
         */
        , saveDataResult: function (params) {
            return sysSaveDataType(params,"result");
        }
        /**
         * 保存数据的方法, 直接保存到 obj
         * @param params : json 格式的参数,
         * ----------------------------------------
         * 参数和 saveData 一样,  不同的是 data
         * data : 数据会被处理, 就是obj 的数据
         * -------------------------------------------------
         * @returns 返回key
         */
        , saveDataObj: function (params) {
            return sysSaveDataType(params,"obj");
        }
        /**
         * 获取数据
         * @param params : json 格式的参数
         * ----------------------------------------
         * key : 参数保存的key, 必填
         * type : 数据的保存方式,默认1 , 和保存数据的方法对应
         * -------------------------------------------------
         * @returns 返回 param : 参数, result : 结果, obj ,其他数据
         */
        , getData: function (params) {
            return sysGetData(params);
        }
        /**
         * 获取数据里面  param 的值
         * 说明: 参数同 getData(params)
         */
        , getDataParam: function (params) {
            var json = sysGetData(params);
            if (json == null) {
                return null;
            }
            return json.param;
        }
        /**
         * 获取数据里面 result 的值
         * 说明: 参数同 getData(params)
         */
        , getDataResult: function (params) {
            var json = sysGetData(params);
            if (json == null) {
                return null;
            }
            return json.result;
        }
        /**
         * 获取数据里面 obj 的值
         * 说明: 参数同 getData(params)
         */
        , getDataObj: function (params) {
            var json = sysGetData(params);
            if (json == null) {
                return null;
            }
            return json.obj;
        }
        /**
         * 清除数据
         * @param params : json 格式的参数
         * ----------------------------------------
         * key : 参数保存的key, 必填
         * type : 数据的保存方式,默认1 , 和保存数据的方法对应
         * -------------------------------------------------
         * @returns 返回 param : 参数, result : 结果, obj ,其他数据
         */
        , cleanData: function (params) {
            params = params == null ? {} : params;
            params.type = params.type == null ? 1 : params.type;
            var type = params.type;
            var tableName = params.key;

            if (type == 1) {
                layui.sessionData(tableName, null);
            } else if (type == 2) {
                layui.data(tableName, null);
            } else {
                console.log("type字段的值不合法,cleanData");
            }
        }
    }

    /**
     * 创建保存数据的key
     */
    function sysCreateKey(params) {
        params = params == null ? {} : params;
        params.prefix = params.prefix == null ? keyPrefix : params.prefix;
        return params.prefix + new Date().getTime();
    }

    /**
     * 保存全部的格式数据
     */
    function sysSaveData(params) {
        params = params == null ? {} : params;
        params.key = params.key == null ? sysCreateKey() : params.key;
        params.type = params.type == null ? 1 : params.type;

        // 验证数据格式
        params.data = params.data == null ? {} : params.data;
        var type = params.type;
        var tableName = params.key;
        if (params.data.param != null) {
            saveData(type, tableName, paramKey, params.data.param);
        }
        if (params.data.result != null) {
            saveData(type, tableName, resultKey, params.data.result);
        }
        if (params.data.obj != null) {
            saveData(type, tableName, objKey, params.data.obj);
        }
        return tableName;
    }

    /**
     * 保存不同参数的数据
     */
    function sysSaveDataType(params, name) {
        params = params == null ? {} : params;
        params.data = params.data == null ? {} : params.data;

        var data = params.data;
        params.data = {};
        params.data[name] = data;

        return sysSaveData(params);
    }

    /**
     * 保存不同类型的数据
     * @param type 类型
     * @param tableName 表名,createKey 的那个方法
     * @param key 不用的数据
     * @param obj 数据的值
     */
    function saveData(type, tableName, key, obj) {
        //页面关闭后即失效
        if (type == 1) {
            layui.sessionData(tableName, {key: key, value: obj});
        }
        // 数据会永久存在，除非物理删除。
        else if (type == 2) {
            layui.data(tableName, {key: key, value: obj});
        } else {
            console.log("type字段的值不合法,saveData");
        }
    }

    /**
     * 获取数据
     */
    function sysGetData(params) {
        params = params == null ? {} : params;
        params.type = params.type == null ? 1 : params.type;
        var type = params.type;
        var tableName = params.key;
        if (type == 1) {
            return layui.sessionData(tableName);
        } else if (type == 2) {
            return layui.data(tableName);
        } else {
            console.log("type字段的值不合法,getData");
        }
        return null;
    }

    exports('sysdata', obj);
});
