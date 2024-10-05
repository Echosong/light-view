/*
 * 时间选择框快捷选择
 *
 * @Author:    二胡子
 * @Date:      2022-09-06 20:49:28
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */

import dayjs from 'dayjs';
import {ref} from 'vue';

export const defaultTimeRanges = ref([{label: '今日', value: [dayjs(), dayjs().add(1, 'days')]}, {
    label: '昨日',
    value: [dayjs().subtract(1, 'days'), dayjs()]
}, {label: '本月', value: [dayjs().startOf('month'), dayjs().endOf('month').add(1, 'days')]}, {
    label: '上个月',
    value: [dayjs().subtract(1, 'months').startOf('month'), dayjs().endOf('month').add(1, 'days')]
}, {
    label: '下个月',
    value: [dayjs().subtract(-1, 'months').startOf('month'), dayjs().subtract(-1, 'months').endOf('month').add(1, 'days')]
},

    {label: '本年度', value: [dayjs().startOf('year'), dayjs().endOf('year').add(1, 'days')]}, {
        label: '上年度',
        value: [dayjs().subtract(1, 'years').startOf('year'), dayjs().subtract(1, 'years').endOf('year').add(1, 'days')]
    }]);

