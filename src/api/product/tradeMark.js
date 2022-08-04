import request from '@/utils/request'

// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => {
    return request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
}

// 添加品牌
export const reqAddOrUpdateTradeMark = (data) => {
    if (data.id) {
        // 修改品牌
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data });
    } else {
        // 添加品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data });
    }
}

// 删除品牌
export const reqDeleteTradeMark = (id) => {
    return request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
}


