<template>
	<view class="login" :class="{show:show}">
		<view class="mask" @tap="closeLogin" bind:tap="cancel" catch:touchmove="emptyHandler"></view>
		<view class="container">

			<view class="close-box" @tap="closeLogin" bind:tap="cancel">
				<image class="close-img" src="/static/close.png" />
			</view>

			<!-- #ifdef MP-WEIXIN -->
			<view class="p-name" v-if="getUserInfoTag">
				welcome
			</view>
			<button class="submit-btn" bindtap="getWeChatUserInfo" v-if="getUserInfoTag">
				<image src="/static/wechat.png" class="wechat-img" />
				<text>一键获取微信信息</text>
			</button>
			<!-- #endif  -->


			<u-form :model="form" ref="uForm" v-show="!getUserInfoTag">
				<u-form-item label="账号" prop="login" label-width="150" required v-if="loginType === 'pwdlogin'">
					<u-input v-model="form.login" placeholder='输入手机号/邮箱/昵称' />
				</u-form-item>

				<u-form-item label="昵称" prop="name" label-width="150" required
					v-if="loginType === 'phone' || loginType === 'email'">
					<u-input v-model="form.name" placeholder='2-10个字符' />
				</u-form-item>

				<u-form-item label="电话" prop="phone" label-width="150" required
					v-if="loginType === 'phone' || loginType === 'codelogin'">
					<u-input v-model="form.phone" placeholder='输入11位手机号码' />
				</u-form-item>
				<u-form-item label="邮箱" prop="email" label-width="150" required v-if="loginType === 'email'">
					<u-input v-model="form.email" placeholder='输入邮箱' />
				</u-form-item>

				<u-form-item label="验证码" prop="code" required label-width="150" v-if="loginType !== 'pwdlogin'">
					<u-input placeholder="请输入4位验证码" v-model="form.code" type="text"></u-input>
					<u-button slot="right" type="success" size="mini" @click="getCode">获取验证码</u-button>
				</u-form-item>

				<u-form-item label="密码" label-width="150" required prop="password" v-if="loginType !== 'codelogin'">
					<u-input v-model="form.password" type="password" placeholder='限4-20个字符,区分大小写' />
				</u-form-item>
				<u-form-item label="重复密码" required label-width="150" prop="repassword"
					v-if="loginType === 'phone' || loginType === 'email'">
					<u-input v-model="form.repassword" type="password" placeholder='再次输入密码' />
				</u-form-item>
				<view class="btns">
					<u-button class="ubtn" @click="submit">提交</u-button>
					<u-button class="ubtn" @click="cancel">取消</u-button>
				</view>
				<view class="type">
					<u-subsection active-color="#007cba" font-size="20" height="52" :list="subsectionList" :current="0"
						@change="sectionChange"></u-subsection>
				</view>
			</u-form>


			<view class="serve-info">点击登录/注册前端论坛，即表示已阅读并同意</view>
			<view class="serve-text">
				<view @tap="gotoWeb('https://uniapp.dcloud.io/component/mp-weixin-plugin')">《隐私政策》</view>
				<view @tap="gotoWeb('https://developers.weixin.qq.com/miniprogram/dev/framework/')">《用户协议》</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "login",
		data() {
			return {
				// 登录组件是否显示
				show: true,
				// 获取用户基础信息
				getUserInfoTag: true,
				// 登录方式
				loginType: 'pwdlogin',
				// 登录方式选择器
				subsectionList: [{
					name: '密码登录'
				}, {
					name: '验证码登录'
				}, {
					name: '手机注册'
				}, {
					name: '邮箱注册'
				}],
				// 用户信息输入框
				form: {
					login: '',
					avatar: '',
					name: '',
					phone: '',
					email: '',
					code: '',
					password: '',
					repassword: ''
				},
				// 用户输入校验规则
				rules: {
					login: [{
						validator: (rule, value, callback) => {
							if (this.loginType === 'pwdlogin') {
								return !this.$u.test.isEmpty(value)
							} else {
								return true
							}
						},
						message: '必填 * 输入内容不许为空',
						trigger: ['change', 'blur'],
					}],

					// 电话，邮件注册校验
					name: [{
						asyncValidator: async (rule, value, callback) => {
							if (this.loginType === 'phone' || this.loginType === 'email') {
								let res = await this.$u.api.findUser({
									name: value
								})
								if (!!value && res.statusCode === 200) {
									callback(new Error('当前您输入的用户昵称已经存在'))
								} else {
									callback()
								}
							} else {
								callback()
							}
						},
						trigger: ['blur']
					}, {
						validator: (rule, value, callback) => {
							if (this.loginType === 'phone' || this.loginType === 'email') {
								return this.$u.test.rangeLength(value, [2, 10])
							} else {
								return true
							}
						},
						message: '必填 * 昵称长度不得小于2位大于10位',
						trigger: ['change', 'blur']
					}],

					// 手机验证码登录，手机验证码注册，使用
					phone: [{
						asyncValidator: async (rule, value, callback) => {
							if (this.loginType === 'phone') {
								let res = await this.$u.api.findUser({
									name: value
								})
								if (!!value && res.statusCode === 200) {
									callback(new Error('当前电话已经注册'))
								} else {
									callback()
								}
							} else {
								callback()
							}
						},
						trigger: ['blur'],
					}, {
						validator: (rule, value, callback) => {
							if (this.loginType === 'codeLogin' || this.loginType === 'phone') {
								// 判断电话号码是否合法
								return this.$u.test.mobile(value)
							} else {
								return true
							}
						},
						message: '必填 * 手机号码输入不正确',
						trigger: ['change', 'blur']
					}],
					// 邮箱验证
					email: [{
						asyncValidator: async (rule, value, callback) => {
							if (this.loginType === 'email') {
								let res = await this.$u.api.findUser({
									name: value
								})
								if (!!value && res.statusCode === 200) {
									callback(new Error('当前邮箱已经注册'));
								} else {
									callbck()
								}
							} else {
								callback()
							}
						},
						trigger: ['blur']
					}, {
						validator: (rule, value, callback) => {
							if (this.loginType === 'email') {
								return this.$u.test.email(value)
							} else {
								return true
							}
						},
						message: '必填 * 邮箱地址输入不正确',
						trigger: ['change', 'blur']
					}],
					// 验证码验证
					code: [{
						validator: (rule, value, callback) => {
							if (this.loginType !== 'pwdlogin') {
								// 长度为2-10
								return value === '8888'
							} else {
								return true
							}
						},
						message: '必填 * 验证码长度为4位',
						// 触发器 可以同时使用blur，change
						trigger: ['change', 'blur']
					}],
					// 密码验证
					password: [{
						validator: (rule, value, callback) => {
							// 除了 手机验证码登录，其他的都需要密码验证
							if (this.loginType !== 'codelogin') {
								return (value.length >= 4 && value.length <= 20)
							} else {
								return true
							}
						},
						message: '必填 * 请输入4-20位密码',
						trigger: ['change', 'blur']
					}],
					// 重置密码
					repassword: [{
						validator: (rule, value, callback) => {
							if (this.loginType === 'phone' || this.loginType === 'email') {
								return this.form.password === value
							} else {
								return false
							}
						},
						message: '必填 * 两次密码输入不一致',
						trigger: ['change', 'blur']
					}],
				}
			};
		},
		methods: {
			// 关闭弹窗
			closeLogin() {
				this.show = false
			},
			openLogin() {
				this.show = true
			},
			gotoWeb(url) {
				wx.navigateTo({
					url: `/pages/webview/webview?url=${encodeURI(url)}`
				})
			},
			// 微信授权
			getWeChatUserInfo() {
				uni.getUserProfile({
					success: res => {
						console.log(res)
						this.getUserInfoTag = false
					},
					fail: () => {
						console.log('用户未授权')
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: flex-end;
		opacity: 0;
		transition: opacity 300, z-index 0 300;
		pointer-events: none;
		z-index: 999;

		&.show {
			z-index: 9999;
			opacity: 1;
			pointer-events: auto;
		}

		.mask {
			position: fixed;
			width: 100%;
			height: 100%;
			background-color: rgba($color: #000000, $alpha: 0.3);
		}

		.container {
			z-index: 999;
			display: flex;
			flex-direction: column;
			width: 100%;
			padding: 40upx 20upx;
			background-color: #f1f1f1;
			border-radius: 20upx;
			align-items: center;
			position: relative;

			.p-name {
				margin-top: 48upx;
				font-size: 36upx;
				font-weight: normal;
			}

			.close-box {
				position: absolute;
				right: 32upx;
				top: 38upx;
				width: 56.56upx;
				height: 56.56upx;
				padding: 10upx;

				.close-img {
					width: 100%;
					height: 100%;
				}
			}
		}

		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 28upx;

			.logo-wrap {
				width: 144upx;
				height: 144upx;
				overflow: hidden;
				border-radius: 20upx;
			}

			.logo {
				width: 100%;
				height: 100%;
			}
		}

		.info {
			color: #333;
		}

		.submit-btn {
			width: 642upx;
			height: 88upx;
			margin-top: 60upx;
			margin-bottom: 60upx;
			border-radius: 44upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			color: #fff;
			background-color: #0046f5;
			font-size: 36upx;

			.wechat-img {
				width: 44upx;
				height: 34upx;
				margin: 0 18upx;
			}
		}

		.phone-login {
			color: #0046f5;
			font-size: 28upx;
			margin-top: 40upx;
			border: none;
			background-color: #f1f1f1;
		}

		.cancel-btn {
			width: 100%;
			margin-top: 60upx;
			color: #333;
			background-color: #f1f1f1;
		}

		.serve-info {
			font-size: 22upx;
			margin-top: 20upx;
		}

		.serve-text {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 22upx;
			color: #6079b8;
			margin-top: 10upx;
		}
	}

	button::after {
		border: none;
	}

	.btns {
		margin-top: 20upx;
		text-align: center;

		.ubtn {
			display: inline-block;
			margin: 0 20upx;
		}
	}

	.type {
		margin-top: 80upx;
	}
</style>
