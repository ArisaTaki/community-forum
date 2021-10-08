<template>
	<view class="index">

		<!-- 顶部导航 -->
		<uni-nav-bar v-if="navBarShowTag">
			<view class="tabs-box">
				<view class="one-nav" :class="curretSwiperIndex === 0? 'nav-actived' : ''" @tap="swiperChange(0)">
					推荐
				</view>
				<view class="one-nav" :class="curretSwiperIndex === 1? 'nav-actived' : ''" @tap="swiperChange(1)">
					资讯
				</view>
			</view>
		</uni-nav-bar>
		<view class="header-box">
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="2500" :duration="500">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<navigator open-type="navigate" :url="`/pages/webview/webview?url=${encodeURI(item.data.link)}`">
						<image class="banner-swiper-img" :src="item.data.image" mode="aspectFill" />
					</navigator>
				</swiper-item>
			</swiper>
			<image class="crile" src="@/static/crile.png" mode="aspectFill" />
			<view class="card-header">
				<view class="card-one card-left" @tap="gotoTab('/pages/feeds/feeds')">
					<image class="img" src="@/static/coffee.png" mode="aspectFill" />
					<view class="iright">
						<view class="title">
							精彩动态
						</view>
					</view>
				</view>
				<view class="card-one card-right" @tap="gotoTab('/pages/me/me')">
					<image class="img" src="/static/ran.png" mode="aspectFill" />
					<view class="iright">
						<view class="title">
							个人中心
						</view>
					</view>
				</view>
			</view>
			<view class="tabs-box">
				<view class="one-nav" :class="curretSwiperIndex === 0 ? 'nav-actived': ''" @tap="swiperChange(0)">
					推荐
				</view>
				<view class="one-nav" :class="curretSwiperIndex === 1 ? 'nav-actived': ''" @tap="swiperChange(1)">
					资讯
				</view>
			</view>
		</view>
		<swiper class="swiper-box" :style="'height:' + swiperSliderHeight" :current="curretSwiperIndex"
			@animationfinish="swiperSlider">
			<swiper-item class="swiper-item sns-now">
				<view class="feeds-box">
					<sns-waterfall v-model="feedsList" ref="waterfall">
						<template v-slot:left="{leftList}">
							<view class="feed-one" v-for="(item, index) in leftList" :key="index">
								<navigator open-type="navigate" :url=" `/subpages/feedInfo?id=${item.id}` ">
									<image :src="item.cover" mode="widthFix" :lazy-load="true" class="feed-img" />
									<view class="u-line-2 feed-title" v-if="!!item.feed_content">
										{{item.feed_content}}
									</view>
									<view class="feed-info">
										<view class="ilike">
											<image class="avatar" :src="item.avatar" />
											<text class="name u-line-1">{{ item.name }}</text>
											<view class="iview">
												<view class="ilike">
													<image v-if="item.has_like" src="@/static/lover.png"
														class="micon" />
													<image v-else src="@/static/love.png" class="micon" />
													<text class="love-count" v-if="item.like_count > 0">
														{{item.like_count}}</text>
												</view>
											</view>
										</view>
									</view>
								</navigator>
							</view>
						</template>
						<template v-slot:right="{rightList}">
							<view class="feed-one" v-for="(item, index) in rightList" :key="index">
								<navigator open-type="navigate" :url=" `/subpages/feedInfo?id=${item.id}` ">
									<image :src="item.cover" mode="widthFix" :lazy-load="true" class="feed-img" />
									<view class="u-line-2 feed-title" v-if="!!item.feed_content">
										{{item.feed_content}}
									</view>
									<view class="feed-info">
										<view class="ilike">
											<image class="avatar" :src="item.avatar" />
											<text class="name u-line-1">{{ item.name }}</text>
											<view class="iview">
												<view class="ilike">
													<image v-if="item.has_like" src="@/static/lover.png"
														class="micon" />
													<image v-else src="@/static/love.png" class="micon" />
													<text class="love-count" v-if="item.like_count > 0">
														{{item.like_count}}</text>
												</view>
											</view>
										</view>
									</view>
								</navigator>
							</view>
						</template>
					</sns-waterfall>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item sns-news">
				<view v-for="(item, index) in newsList" :key="index">
					<navigator :url="`/subpages/newInfo?id=${item.id}`" open-type="navigate" class="one-new">
						<view class="left">
							<view class="title u-line-2">
								{{item.title}}
							</view>
							<view class="uinfo">
								<view class="iview">
									<view class="utime">
										<text class="name">{{item.author}}</text>
									</view>
								</view>
								<text class="uptime">{{item.created_at | timeFormate}}发布</text>
							</view>
						</view>
						<view class="right">
							<image :src="item.cover" mode="aspectFill" class="pic" />
						</view>
					</navigator>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import timeFrom from '@/tools/timeFrom.js'
	import snsWaterfall from '@/components/sns-waterfall/sns-waterfall.vue'
	export default {
		data() {
			return {
				// 轮播图广告列表信息
				swiperList: [],
				// 当前推荐资讯的滑动位置
				curretSwiperIndex: 0,
				// 当前推荐资讯的高亮显示
				curretSwiperIndexStyle: '',
				// 动态列表数据
				feedsList: [],
				// 资讯列表数据
				newsList: [],
				// 滑动页面轮播器的高度
				swiperSliderHeight: '1000px',
				// 滑动页面轮播器的高度
				swiperSliderFeedsHeight: '0px',
				// 资讯轮播图高度
				swiperSliderNewsHeight: '0px',
				// NavBar 显示状态控制
				navBarShowTag: false,
				// 记录推荐滚动所处位置
				oldFeedsScrollTop: 0,
				// 记录资讯滚动所处位置
				oldNewsScrollTop: 0
			}
		},

		components: {
			snsWaterfall
		},
		onLoad() {
			// 初始化获取广告信息
			this.getAds()
			// 初始化获取动态信息
			this.getFeeds()
			// 初始化获取资讯信息
			this.getNews()
		},
		onPageScroll(event) {
			if (this.curretSwiperIndex === 0) {
				this.oldFeedsScrollTop = event.scrollTop
			} else {
				this.oldNewsScrollTop = event.scrollTop
			}
			if (event.scrollTop > 220) {
				this.navBarShowTag = true
			} else {
				this.navBarShowTag = false
			}
		},
		onPullDownRefresh() {
			this.getAds()
			if (this.curretSwiperIndex === 0) {
				this.$refs.waterfall.clear()
				this.getFeeds()
			} else {
				this.getNews()
			}
		},
		// 下拉至底部请求新的数据
		onReachBottom() {
			if (this.curretSwiperIndex === 0) {
				this.getFeeds()
			}
		},
		methods: {
			// 推荐、资讯、滑动切换方法
			swiperSlider(event) {
				let index = event.detail.current
				if (index === 0) {
					this.swiperSliderHeight = this.swiperSliderFeedsHeight
					setTimeout(() => {
						uni.pageScrollTo({
							duration:0,
							scrollTop:this.oldFeedsScrollTop
						})
					},50)
				} else {
					this.swiperSliderHeight = this.swiperSliderNewsHeight
					setTimeout(() => {
						uni.pageScrollTo({
							duration:0,
							scrollTop:this.oldNewsScrollTop
						})
					}, 50)
				}
				this.curretSwiperIndex = index
			},
			// Tab链接跳转
			gotoTab(url) {
				uni.switchTab({
					url
				})
			},
			// 获取广告信息
			async getAds() {
				this.swiperList = await this.$u.api.getAdverts()
			},
			// 获取动态信息
			async getFeeds() {
				let feeds = await this.$u.api.getFeeds()
				let feedsList = feeds.feeds.map((item) => {
					return {
						...item,
						cover: this.BaseFileURL + item.images[0].file,
						avatar: !!item.user.avatar ? item.user.avatar.url : '/static/nopic.png',
						name: item.user.name
					}
				})
				this.feedsList = [...this.feedsList, ...feedsList]
				uni.$once('swiperHeightChange', height => {
					this.swiperSliderFeedsHeight = height
					this.swiperSliderHeight = height
				})
			},
			// 获取资讯信息 
			async getNews() {
				let news = await this.$u.api.getNews()
				let newsList = news.map((item) => {
					return {
						...item,
						cover: this.BaseFileURL + item.image.id
					}
				})
				this.newsList = [...this.newsList, ...newsList]
				this.swiperSliderNewsHeight = (this.newsList.length * 95 + 100) + 'px'
				this.swiperSliderHeight = this.swiperSliderNewsHeight
			},
			// 推荐，资讯点击切换方法
			swiperChange(index) {
				if (index === 0) {
					this.swiperSliderHeight = this.swiperSliderFeedsHeight
					setTimeout(() => {
						uni.pageScrollTo({
							duration:0,
							scrollTop:this.oldFeedsScrollTop
						})
					}, 50)
				} else {
					this.swiperSliderHeight = this.swiperSliderNewsHeight
					setTimeout(() => {
						uni.pageScrollTo({
							duration:0,
							scrollTop:this.oldNewsScrollTop
						})
					}, 50)
				}
				this.curretSwiperIndex = index
			}
		},
		filters: {
			timeFormate(timeDate) {
				let Time = new Date(timeDate);
				let timestemp = Time.getTime();
				let t = timeFrom(timestemp, "yyyy年mm月dd日");
				return t;
			}
		},
	}
</script>
<style lang="scss" scoped>
	#sns {
		background-color: #f1f1f1;
	}

	// 推荐、咨询 按钮样式
	.tabs-box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 750upx;

		.one-nav {
			width: 120upx;
			color: #9B9B9B;
			font-size: 36upx;
			text-align: center;
			font-weight: blod;

			&.nav-actived {
				color: #0050FF;
			}
		}
	}

	.header-box {
		position: relative;
		left: 0;
		height: 500upx;
		background-color: #f1f1f1;
		z-index: 1;

		// 广告位轮播器相关样式
		.swiper {
			width: 750upx;
			height: 400upx;
			position: absolute;
			left: 0;
			top: 0;
			text-align: center;
			z-index: 1;

			.banner-swiper-img {
				width: 750upx;
				height: 400upx;
				box-shadow: 0 0 2px 0 rgb(188, 188, 188);
			}
		}

		.crile {
			width: 750upx;
			height: 50upx;
			position: absolute;
			left: 0;
			top: 355upx;
			z-index: 9;
		}

		// 新鲜事 活动墙 按钮样式
		.card-header {
			position: absolute;
			left: 0;
			top: 320upx;
			height: 160upx;
			z-index: 99;
			width: 710upx;
			margin-left: 20upx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			align-content: center;

			.card-one {
				width: 328upx;
				height: 96upx;
				border-radius: 49upx;
				background-color: #fff;
				margin: 0 10upx;
				box-shadow: 0 0 2px 0 rgb(188, 188, 188);
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: center;

				.img {
					width: 44upx;
					height: 44upx;
					margin-left: 50upx;
				}

				.iright {
					margin-left: 30upx;
					text-align: left;
					color: #888;

					.title {
						font-size: 30upx;
						color: #001432;
					}

					.iview {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;
						font-size: 20upx;
						margin-top: -5upx;
					}
				}
			}
		}

		// 推荐、咨询 按钮样式
		.tabs-box {
			width: 750upx;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 480upx;
			display: flex;
			flex-direction: row;
			justify-content: center;

			.one-nav {
				height: 80upx;
				width: 110upx;
				color: #9B9B9B;
				font-size: 36upx;
				text-align: center;
				font-weight: blod;

				&.nav-actived {
					color: #0050FF;
				}
			}
		}
	}

	// 此刻 栏目样式\
	.swiper-box {
		background-color: #f1f1f1;
		padding: 60upx 0 40upx;
	}

	.sns-now {

		// 动态相关瀑布流样式
		.feeds-box {
			width: 735upx;
			margin-left: 13upx;
			padding-bottom: 20upx;

			.feed-one {
				width: 358upx;
				margin-bottom: 12upx;
				background-color: #FFF;
				border-radius: 20upx;

				position: relative;

				.feed-img {
					width: 358upx;
					height: 300upx;
					border-radius: 10upx;
				}

				.feed-title {
					width: 350upx;
					margin-top: 15upx;
					margin-left: 10upx;
					font-size: 28upx;
					line-height: 40upx;
					color: #001432;
					text-align: left;
				}

				.feed-info {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					margin-top: 10upx;
					font-size: 20upx;
					color: #666;
					padding: 0 10upx 16upx;

					.iview {
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;

						.ilike {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
							justify-content: space-between;
							align-items: center;
							align-content: center;
							height: 60upx;
							padding: 0 10upx;
							background-color: #FFFFFF;
						}
					}

					.avatar {
						margin-right: 10upx;
						height: 40upx;
						width: 40upx;
						border-radius: 50%;
						border: 1upx solid #eee;
					}

					.name {
						max-width: 120upx;
						color: #757474;
					}

					.micon {
						width: 32upx;
						height: 28upx;
					}

					.love-count {
						padding-left: 10upx;
						color: #757474;
					}
				}
			}
		}
	}

	// 轮播页面 资讯
	.sns-news {
		background-color: #fff;
		width: 750upx;

		.one-new {
			width: 700upx;
			height: 74px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-around;
			align-items: flex-start;
			align-content: center;
			padding-bottom: 10px;
			padding-top: 10px;
			padding-left: 25upx;
			padding-right: 25upx;
			border-bottom: 1px solid #f1f1f1;

			.left {
				width: 490upx;
				height: 140upx;
				text-align: left;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;

				.title {
					font-size: 30upx;
					line-height: 42upx;
					color: #001432;
					margin-top: 21upx;
				}

				.uinfo {
					width: 490upx;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					margin-top: 6upx;
					font-size: 20upx;
					color: #999;

					.utime {
						font-size: 24upx;

						.name {
							max-width: 120upx;
							color: #777;
						}
					}
				}
			}

			.right {
				width: 120upx;

				.pic {
					width: 120upx;
					height: 120upx;
					margin-top: 20upx;
					border-radius: 6upx;
				}
			}
		}
	}
</style>
