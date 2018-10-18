/**
 * Image组件
 * @param {String}[默认值：null] src 图片源
 * @param {String}[默认值：null] className 自定义css类名
 * @param {Boolean}[默认值：false] lazy 懒加载
 * @param {String}[默认值：window] box 懒加载滚动监控元素
 * @param {Number}[默认值：100] distance 元素距离页面显示的阀值
*/
import React from 'react';
import _ from './index.css';

class ImgLoad extends React.Component {
	constructor(){
		super();
		this.state = {
			load: 0, // 0 = 待加载 | 1 = 加载成功 | 2 = 加载失败
			src: null,
		}
	}
	componentDidMount(){
		const { src, lazy = false } = this.props;
		this.setState({ src });
		// 懒加载
		if( lazy ){
			let { box = false } = this.props;
			box = box ? document.querySelector(box) : window;
			const obj = this.refs.lazy;
			const WindowHeight = window.screen.availHeight;
			// 绑定事件(防抖)
			let fun;
			let bindScroll = ()=>{
				clearTimeout(fun);
				fun = setTimeout(()=>{
					const { distance = 100 } = this.props;
					const { top } = obj.getBoundingClientRect();
					if( top - WindowHeight < distance ){
						this.loadImage(src);
						box.removeEventListener('scroll', bindScroll);
					}
				}, 100);
			}
			box.addEventListener('scroll', bindScroll);
		}else { this.loadImage(src) }
	}
	// 加载图片
	loadImage( src ){
		const img = new Image();
		img.src = src;
		img.onload = ()=> this.setState({ load: 1 });
		img.onerror = (img)=>{
			this.setState({ load: 2 });
			console.warn('图片加载失败，src:'+src);
		}
	}
	render() {
		const { load, src } = this.state;
		const { className } = this.props;
		switch(load){
			case 0:
				return <i ref="lazy" className={`iconfont icon-tupian ${className+' '+_.loading}`}/>;
				break;
			case 1:
				return <img src={src} className={`animated fadeIn ${ className+' '+_.img }`}/>;
				break;
			case 2: 
				return <i className={`iconfont icon-jiazaitupianshibai ${ className+' '+_.load_err }`}/>;
				break;
		}
	}
}

export default ImgLoad;