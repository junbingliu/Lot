import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from "../../../static/style/ole.css";
import {olePostUtil} from "../../OleApiUtil/oleApiUtil";
import {CANCEL_DETAIL_URL,COUPON_LIST_URL,RECEIVE_COUPON_URL,COUPON_USER_URL,WX_SHARE_LINK_API} from "../../consts";
import {loginStore} from "../../Core/store"
import $ from 'jquery';
import Lot from './Lot'

@withStyles(styles)
export default class lotteryCp extends Component{

    constructor(){
        super();
        this.state={
            running:false,
            Q:5
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        Lot($);
    }

    handleClick(){
        let self=this;
        if(self.state.running)return;
        let a=this.rnd(0,5);
        let Q=self.state.Q;
        this.rotateFn(a,Q,''+a);
        console.log(a);
    }

    getAg(a,q){
        if(typeof a !== "number")a=Number(a)
        if(typeof q !== "number")q=Number(q)
        switch (a) {
            case 0:return 0;
            case 1:return 180/(-q);
            default:return -180/q*(1+2*(a-1));
        }
    }

    rnd(n, m){
        return Math.floor(Math.random()*(m-n+1)+n)
    }

    rotateFn(a,Q,txt){
        let self=this;
        let ag = self.getAg(a,Q);
        self.setState({running:!self.state.running})
        let rotate=self.refs['rotate'];
        $(rotate).stopRotate();
        $(rotate).rotate({
            angle:0,
            animateTo:ag+3600,
            duration:6000,
            callback:function (){
                alert(txt);
                self.setState({running:!self.state.running})
            }
        })
    }


    getLoginId(self){
      let loginId=loginStore.getAttr('userId') || '';
      self.setState({loginId:loginId})
    }

    showPage(){
        return(
            <article className="">
                <div className="lucky-draw">
                    <div className="draw-cont">
                        <div className="lucky-img">
                            <img src={require('../../../static/img/lotteryBc.jpg')}/>
                        </div>
                        <div className="lucky-wheel">
                            <div className="pic"><img ref="rotate" src={require('../../../static/img/rotateBc.png')}/></div>
                            <div className="ico-wheel" onClick={this.handleClick.bind(this)}><img src={require('../../../static/img/ico-wheel.png')}/></div>

                        </div>
                        <div className="draw-info">
                            <input type="text" placeholder="输入小票号Enter a ticket" />
                            <div className="draw-bnt"><a href="" className="bnt">扫一扫</a></div>
                            <div className="draw-bnt"><a href="" className="bnt">抽奖Csek to join the lotter Draw </a></div>
                        </div>
                    </div>

                    <div className="draw-rule">

                        <div className="line"></div>
                        <div className="rank-list">
                            <div className="tit">
                                <p className="">—中奖排行榜—</p>
                                <p className="tab">Roaring list to winning</p>
                            </div>
                            <ul>
                                <li className="item clearfix">
                                    <em className="name ">史蒂夫你</em> <span className="goods">抽到二等奖伊比利亚谷物饲养火腿前腿切片500克</span>
                                </li>
                                <li className="item clearfix">
                                    <em className="name">史蒂夫</em> <span className="goods">抽到二等奖伊比利亚谷物</span>
                                </li>
                                <li className="item clearfix">
                                    <em className="name">史蒂</em> <span className="goods">抽到二等奖伊比利亚谷物饲养火腿前腿切片500克抽到二等奖伊比利亚谷物饲养火腿前腿切片500克</span>
                                </li>
                            </ul>
                        </div>
                        <div className="rule">
                            <h3 className="tit">—活动规则—</h3>
                            <p className="txt clearfix"><em className="num">1、</em><span className="tab">会员任意消费，扫码小票二维码，可参与幸运抽奖；</span></p>
                            <p className="txt clearfix"><em className="num">2、</em><span className="tab">会员每张小票仅可抽奖一次，没个会员当天仅可参与一次；</span></p>
                            <p className="txt clearfix"><em className="num">3、</em><span className="tab">中奖者信息会发送至您绑定的微信会员账户，实物奖品将由客服在7个工作日内与您联系确认奖品的领取方式；</span></p>
                            <p className="txt clearfix"><em className="num">4、</em><span className="tab">券类礼品奖项，抽奖后，系统自动推送代金券，会员可在我的卡包中查看中奖礼券。</span></p>
                        </div>
                    </div>
                </div>
            </article>
        )
    }

    render(){
        return(
            <div className="container">
                {this.showPage()}
            </div>
        )
    }
}
