import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import Parent1 from './page'
import './page.scss'

class Parent extends React.Component{

	constructor(...args) {
		super(...args)
		this.state = {
			isImgShow: false,
			imgIndex: 1
		}
	}

	showImg(imgIndex = 0) {
		this.setState({
			isImgShow: !this.state.isImgShow,
			imgIndex: imgIndex + 1
		})
	}

	render() {
		const images = imgArray
		return (
            <div>
    			<div className='Slide'>
    				<ShowImg itemImages={images} showImg={this.showImg.bind(this)} />
    				{
    					this.state.isImgShow && <ImgSlidePlay itemImages={images} showImg={this.showImg.bind(this)} imgIndex={this.state.imgIndex}/>
    				}  			
    	  		</div>
                <Link to='about' className="test">
                    <p>111</p>
                </Link>
                {this.props.children}
            </div>
		)
	}
}

let ShowImg = React.createClass({

	render() {
		const { itemImages, showImg } = this.props

		return (
            <div>
    			<ul className="Slide__ItemImg flex ">
    				{
    					itemImages.map((item, index) => {
    						return (
    							<li key={index} onClick={showImg.bind(null, index)}>
    								<img src={item} />
    							</li>
    						)
    					})
    				}
    			</ul>
            </div>
		)
	}
})

class ImgSlidePlay extends React.Component{

	constructor(...props) {
        super(...props)
        this.touchRange = 0 // 触控距离
		this.count = 0 // 控制弹层总显示的数字以及当前显示的图片
		this.screenWidth = document.body.clientWidth //屏幕宽度
        this.state = {
            imgIndex: this.props.imgIndex,
            hasMoveStyle: true
        }
    }

    componentDidMount() {
        let carouselImg = this.refs.carouselImg
        if (carouselImg) {
            let imgChildren = Array.from(carouselImg.children, item => item.style.width = this.screenWidth + "px")
            let index = this.props.imgIndex - 1
            carouselImg.style.webkitTransform = 'translate3d(' + index * (-this.screenWidth) + 'px, 0, 0)'
            this.count = index
        }
    }

    startMoveImg(e) {
        this.setState({
        	hasMoveStyle: false
        })
        this.touchRange = e.touches[0].pageX
        e.preventDefault()
    }

    movingImg(length, e) {
        let moveDirection = this.touchRange - e.touches[0].pageX // 当滑动到边界时，再滑动会没有效果
        if ((this.count === 0 && moveDirection < 0) || (this.count === length - 1 && moveDirection > 0)) {
            return
        }

        let conunts = this.count * -this.screenWidth

        this.refs.carouselImg.style.webkitTransform = 'translate3d(' + (conunts - (this.touchRange - e.changedTouches[0].pageX)) + 'px, 0, 0)'
    }

    endMoveImg(length, itemImages, e) {

        this.setState({
        	hasMoveStyle: true
        })

        if (this.touchRange - e.changedTouches[0].pageX > 100) {
            this.count++
            if (this.count === length) {
                this.count = length - 1
                return
            }
            this.setState({
                imgIndex: this.state.imgIndex + 1
            })
        } else if (this.touchRange - e.changedTouches[0].pageX < -100) {
            this.count--
            if (this.count < 0) {
                this.count = 0
                return
            }
            this.setState({
                imgIndex: this.state.imgIndex - 1
            })
        }

        this.refs.carouselImg.style.webkitTransform = 'translate3d(' + this.count * (-this.screenWidth) + 'px, 0, 0)'
    }

	render() {
		const { itemImages, showImg } = this.props

		return (
		  	<div className="Slide__Img">
                <p>{this.state.imgIndex}/{itemImages.length}</p>
                <span onClick={showImg.bind(null)}>×</span>
                <ul className={this.state.hasMoveStyle ? `flex full-height translate` : `flex full-height`} ref="carouselImg">
                    {
                        itemImages.map((item, index) => (
                            <li className="flex flex-center flex-columns"
                                onTouchStart={this.startMoveImg.bind(this)}
                                onTouchMove={this.movingImg.bind(this, itemImages.length)}
                                onTouchEnd={this.endMoveImg.bind(this, itemImages.length, itemImages)}
                                key={index}>
                                <img src={item} />
                            </li>
                        ))
                    }
                </ul>
            </div>
		)
	}
}

ReactDom.render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Parent}>
                <Route path='/about' component={Parent1} />
            </Route>
        </Router>
    </Provider>
    ),
  	document.getElementById('app')
)
