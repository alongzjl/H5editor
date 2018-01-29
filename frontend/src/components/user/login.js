import React from 'react';
import { hashHistory } from 'react-router';
import './login.less';
import Fetch from '../../common/FetchIt';
import API_URL from '../../common/url';
import t from '../i18n';

export default function Login() {
    return (
        <div>
            <div className="header">
                <div className="messagePerson clear">
                    <div className="logoImg fl">
                        <img src={require('./images/logo-o.png')} />
                    </div>
                </div>
            </div>
            <div className="login-logo">
                <img src={require('./images/login_left.jpg')} className="loginImg" />
                <LoginInput />
            </div>
        </div>
    );
} 
 
class LoginInput extends React.Component {
    state = {
        type: 1,
        mobile: '',
        email: '',
        mobilePass: '',
        emailPass: '',
    }
    chooseType = num => {
        this.setState({
            type: num,
        });
    }
    emailLogin = e => {
        this.setState({
            email: e.target.value,
        });
    }
    emailPassLogin = e => {
        this.setState({
            emailPass: e.target.value,
        });
    }
    mobileLogin = e => {
        this.setState({
            mobile: e.target.value,
        });
    }
    mobilePassLogin = e => {
        this.setState({
            mobilePass: e.target.value,
        });
    }
    goTo = type => {
        const path = '/template';
        if (type === 1) {
            /* 判断是邮箱登陆*/
            Fetch.post(API_URL.user.login, `emailOrPhone=${this.state.email}&password=${this.state.emailPass}`).then(data => {
                sessionStorage.setItem('access_token', data);
                hashHistory.push(path);
            });
        } else {
            /* 手机登陆*/
            Fetch.post(API_URL.user.login, `emailOrPhone=${this.state.mobile}&password=${this.state.mobilePass}`).then(data => {
                sessionStorage.setItem('access_token', data);
                hashHistory.push(path);
            });
        }
    }
    render() {
        const countries = [
            '中国',
            '中国台湾',
            '东帝汶民主共和国',
            '中非共和国',
            '丹麦',
            '乌克兰',
            '乌兹别克斯坦',
            '乌干达',
            '乌拉圭',
            '乍得',
            '也门',
            '亚美尼亚',
            '以色列',
            '伊拉克',
            '伊朗',
            '伯利兹',
            '佛得角',
            '俄罗斯',
            '保加利亚',
            '克罗地亚',
            '关岛',
            '冈比亚',
            '冰岛',
            '几内亚',
            '几内亚比绍',
            '列支敦士登',
            '刚果共和国',
            '刚果民主共和国',
            '利比亚',
            '利比里亚',
            '加拿大',
            '加纳 ',
            '加蓬',
            '匈牙利',
            '南非',
            '博茨瓦纳',
            '卡塔尔',
            '卢旺达 ',
            '卢森堡',
            '印尼',
            '印度',
            '危地马拉',
            '厄瓜多尔',
            '厄立特里亚',
            '叙利亚',
            '古巴',
            '吉尔吉斯斯坦',
            '吉布提',
            '哥伦比亚',
            '哥斯达黎加',
            '喀麦隆',
            '图瓦卢',
            '土库曼斯坦',
            '土耳其',
            '圣卢西亚',
            '圣基茨和尼维斯',
            '圣多美和普林西比',
            '圣文森特和格林纳丁斯',
            '圣皮埃尔和密克隆群岛',
            '圣赫勒拿岛',
            '圣马力诺',
            '圭亚那',
            '坦桑尼亚',
            '埃及',
            '埃塞俄比亚',
            '基里巴斯',
            '塔吉克斯坦',
            '塞内加尔',
            '塞尔维亚',
            '塞拉利昂',
            '塞浦路斯',
            '塞舌尔',
            '墨西哥',
            '多哥',
            '多米尼克',
            '奥地利',
            '委内瑞拉',
            '孟加拉',
            '安哥拉',
            '安圭拉岛',
            '安道尔',
            '密克罗尼西亚',
            '尼加拉瓜',
            '尼日利亚',
            '尼日尔',
            '尼泊尔',
            '巴勒斯坦',
            '巴哈马',
            '巴基斯坦',
            '巴巴多斯',
            '巴布亚新几内亚',
            '巴拉圭',
            '巴拿马',
            '巴林',
            '巴西',
            '布基纳法索',
            '布隆迪',
            '希腊',
            '帕劳',
            '库克群岛',
            '开曼群岛',
            '德国',
            '意大利',
            '所罗门群岛',
            '托克劳',
            '拉脱维亚',
            '挪威',
            '捷克共和国',
            '摩尔多瓦',
            '摩洛哥',
            '摩纳哥',
            '文莱',
            '斐济',
            '斯威士兰王国',
            '斯洛伐克',
            '斯洛文尼亚',
            '斯里兰卡',
            '新加坡',
            '新喀里多尼亚',
            '新西兰',
            '日本',
            '智利',
            '朝鲜',
            '柬埔寨 ',
            '格林纳达',
            '格陵兰',
            '格鲁吉亚',
            '比利时',
            '毛里塔尼亚',
            '毛里求斯',
            '汤加',
            '沙特阿拉伯',
            '法国',
            '法属圭亚那',
            '法属波利尼西亚',
            '法属西印度群岛',
            '法罗群岛',
            '波兰',
            '波多黎各',
            '波黑',
            '泰国',
            '津巴布韦',
            '洪都拉斯',
            '海地',
            '澳大利亚',
            '澳门',
            '爱尔兰',
            '爱沙尼亚',
            '牙买加 ',
            '特克斯和凯科斯群岛',
            '特立尼达和多巴哥',
            '玻利维亚',
            '瑙鲁',
            '瑞典',
            '瑞士',
            '瓜德罗普',
            '瓦利斯和富图纳群岛',
            '瓦努阿图',
            '留尼汪 ',
            '白俄罗斯',
            '百慕大',
            '直布罗陀',
            '福克兰群岛',
            '科威特',
            '科摩罗和马约特',
            '科特迪瓦',
            '秘鲁',
            '突尼斯',
            '立陶宛',
            '索马里',
            '约旦',
            '纳米比亚',
            '纽埃岛',
            '缅甸  ',
            '罗马尼亚',
            '美国',
            '美属维京群岛',
            '美属萨摩亚',
            '老挝',
            '肯尼亚',
            '芬兰',
            '苏丹',
            '苏里南',
            '英国',
            '英属维京群岛',
            '荷兰',
            '荷属安的列斯',
            '莫桑比克',
            '莱索托',
            '菲律宾',
            '萨尔瓦多',
            '萨摩亚',
            '葡萄牙',
            '蒙古',
            '西班牙',
            '贝宁',
            '赞比亚',
            '赤道几内亚',
            '越南',
            '阿塞拜疆',
            '阿富汗',
            '阿尔及利亚',
            '阿尔巴尼亚',
            '阿拉伯联合酋长国',
            '阿曼',
            '阿根廷',
            '阿鲁巴',
            '韩国',
            '香港  ',
            '马其顿',
            '马尔代夫  ',
            '马拉维',
            '马来西亚',
            '马绍尔群岛',
            '马耳他',
            '马达加斯加',
            '马里',
            '黎巴嫩',
            '黑山共和国',
        ];
        const codes = ['86',
            '886',
            '670',
            '236',
            '45',
            '380',
            '998',
            '256',
            '598',
            '235',
            '967',
            '374',
            '972',
            '964',
            '98',
            '501',
            '238',
            '7',
            '359',
            '385',
            '1671',
            '220',
            '354',
            '224',
            '245',
            '423',
            '242',
            '243',
            '218',
            '231',
            '1',
            '233',
            '241',
            '36',
            '27',
            '267',
            '974',
            '250',
            '352',
            '62',
            '91,918,919',
            '502',
            '593',
            '291',
            '963',
            '53',
            '996',
            '253',
            '57',
            '506',
            '237',
            '688',
            '993',
            '90',
            '1758',
            '1869',
            '239',
            '1784',
            '508',
            '290',
            '378',
            '592',
            '255',
            '20',
            '251',
            '686',
            '992',
            '221',
            '381',
            '232',
            '357',
            '248',
            '52',
            '228',
            '1767',
            '43',
            '58',
            '880',
            '244',
            '1264',
            '376',
            '691',
            '505',
            '234',
            '227',
            '977',
            '970',
            '1242',
            '92',
            '1246',
            '675',
            '595',
            '507',
            '973',
            '55',
            '226',
            '257',
            '30',
            '680',
            '682',
            '1345',
            '49',
            '39',
            '677',
            '690',
            '371',
            '47',
            '420',
            '373',
            '212',
            '377',
            '673',
            '679',
            '268',
            '421',
            '386',
            '94',
            '65',
            '687',
            '64',
            '81',
            '56',
            '850',
            '855',
            '1473',
            '299',
            '995',
            '32',
            '222',
            '230',
            '676',
            '966',
            '33',
            '594',
            '689',
            '596',
            '298',
            '48',
            '17,871,939',
            '387',
            '66',
            '263',
            '504',
            '509',
            '61',
            '853',
            '353',
            '372',
            '1876',
            '1649',
            '1868',
            '591',
            '674',
            '46',
            '41',
            '590',
            '681',
            '678',
            '262',
            '375',
            '1441',
            '350',
            '500',
            '965',
            '269',
            '225',
            '51',
            '216',
            '370',
            '252',
            '962',
            '264',
            '683',
            '95',
            '40',
            '1',
            '1340',
            '1684',
            '856',
            '254',
            '358',
            '249',
            '597',
            '44',
            '1284',
            '31',
            '599',
            '258',
            '266',
            '63',
            '503',
            '685',
            '351',
            '976',
            '34',
            '229',
            '260',
            '240',
            '84',
            '994',
            '93',
            '213',
            '355',
            '971',
            '968',
            '54',
            '297',
            '82',
            '852',
            '389',
            '960',
            '265',
            '60',
            '692',
            '356',
            '261',
            '223',
            '961',
            '382',
        ];
        return (
            <div className="content">
                <ul className="lognTitle">
                    <li onClick={() => this.chooseType(1)} className={this.state.type === 1 ? 'chooseLi' : ''}>{t('login_email')}</li>
                    <li onClick={() => this.chooseType(2)} className={this.state.type === 2 ? 'chooseLi' : ''}>{t('login_phone')}</li>
                    <div style={{ clear: 'both' }} />
                </ul>
                {
                this.state.type === 1 ? <div className="emailLoginInp">
                    <input className="userNameEmail" type="email" placeholder={t('login_email_placeholder')} onChange={this.emailLogin} />
                    <input className="userPasswordEmail userNameEmail" type="password" placeholder={t('login_password_placeholder')} onChange={this.emailPassLogin} />
                </div> : <div className="emailLoginInp">
                    <div>
                        <select>
                            {
                 countries.map((item, index) => <option value={codes[index]} key={index}>{item}</option>)
                }
                        </select>
                        <input className="userNameMobile userNameEmail" type="number" placeholder={t('login_phone_placeholder')} onChange={this.mobileLogin} />
                        <div style={{ clear: 'both' }} />
                    </div>
                    <input className="userNameEmail" type="password" placeholder={t('login_password_placeholder')} onChange={this.mobilePassLogin} /></div>
            }
                <div className="loginBut" onClick={() => this.goTo(this.state.type)}>{t('login')}</div>
            </div>
        );
    }
 }
