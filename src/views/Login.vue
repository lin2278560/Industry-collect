<template>
    <div class="layout">
        <div class="layout1"></div>
        <Row class="layout2" type="flex" justify="center">
            <Form @keyup.13.native="submit" :model="login" ref="plat_form" >
                <div style="font-size: 17px;text-align: center;padding:15px 0 10px 0;">
                    {{title}}
                </div>
                <div style="width: 250px;margin: auto;">
                <FormItem style="margin:0 0 12px 0;" prop="name">
                    <Input v-model="login.username" prefix="md-person" placeholder="账号">
                    </Input>
                </FormItem>
                <FormItem style="margin:0 0 12px 0;" prop="passWord">
                    <Input v-model="login.password" prefix="md-lock" type="password" placeholder="密码">
                    </Input>
                </FormItem>
                <FormItem style="margin:0 0 12px 0;" prop="captcha">
                    <Row :gutter="32">
                        <Col span="12">
                        <Input v-model="login.captcha" type="text" placeholder="验证码"/>
                        </Col>
                        <Col span="10">
                        <img @click="getCode" alt="点击刷新验证码" class="form-control" ref="captcha"
                             src="data:image/png;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a
HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy
MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAjAEsDASIA
AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA
AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3
ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm
p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA
AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx
BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK
U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3
uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1i1tb
drSFmgiJKKSSg54prpZh2iaFImxkMUXpnr3H50+F2SygwAB5a/OeQOO4qB53by5njxs3BXQ5BPr9
MBv8e9bNmCQyK2DwSsUTzI2KkLGuGx6fLU3kRhCy20UinBVtg6YHUYH6Z+lebNY2X9mz3F/PKPEp
kYhVkIlWYMPLCKvBUgrgqD14IA46jU9K1PU9P0ixupmitsb9SjiZlkmPl4MYKfKULF9wyOMY6VlT
qOT1NZU0jejjtbl3EcCI6jlGUDP19D9Pb6VV+zwGDcVxIq52kYU4PIPv+PcfQcjcaJp3hrV9Cn8P
psnu78QT2Imd1liIfc7KSSdgIIOMDOTWxZaXDr95fzX6o5t7p4IrbcVCKp5OVPJORz7enA0ZnP3b
W6m5BBZNByYklGRliPzwSQakh+zO6x+VAz7sHCDpgnIx16f/AFhXNWVhbavDqmh3Y+02lu6gIxIJ
TqqZHzDay4POccdsVga74N8N/aYtI0jTlTVLh+rTSuLeLGGkI3EcMNoyQCzDkgGpcmti6UYVFq7f
L/gnpktlCy5jiiVx0ygwfY1hXKq85YBVBAO1BwOBWvpaww2EVnbqY4oIxHEM5IQDA5PUgYz1rJup
C1wx3KOAMKBgcDgc1abM2ka0mRpMLBiAFQtjqeO344qhcvcJp139klVr/wCcxYIwWKnDDPHX14x1
7VfRXk0+L+ICMbWRiNpx3HfGP/rUrwRmKWSJyXYgAkk4PAwc/lz60mrlRdjj9Nm8KT+Go5L46dJM
0Ja5eRgLkvjLnn5ic5IIP07VYTxQ+heC9MuNZMdzeXS7YIpZlVpcn5SzHgAKVJc9M889dyfTbP7b
9plsYBc+YH+0vApIIOFYMOR26/8A65LuxsNURV1aytLnbkRtJEsmzI5IyOAcZz7c9KzhBxd2aOSZ
z2g3Oii+W8uvEGnX2uXZEbOs4IjySViiUnOwHjHVick5wBJd/wBmXF9fSPf3Gm38EgRz55iMwAAU
4OcjA4x2PPqb8Hh7SbTEsej6YksUm5JBbIjRuDkYbGfTB9+o4q1qOm2t1MztaJcSIu0+Yu9l545O
eDuzj2+orR6mVRc2xl+G4LeSW+v7KExQtIscCJnG1FxvBOC2cnPGQeucmqGlR/2v4l17W3yUgmXT
LfzWCSJsGZAQBtILkEE84B6V1ayC0kJiUm3l4U5yFYcevt/nFV4LVLKSX7JBaxiR8uBHsMjMOrDu
TgdeeM9yTNiqXuRaLESbXdPNMLOdyqQPlIPYe/bHuOcVlTRBJCHyrYGQT7VfkVZRscCNvVMhB2GQ
ffPPbPPNUrtW+0vvZSeOS2cjHHP0xVomQJf3MMapHLtXHTaP8KX+0rtyA0uRkH7o7H6UUVdjK7uL
/al5/wA9v/HR/hTI7ycPlXC/7qgDqPSiihocW7jlvbiEu0cmCxGeB2zSLdTEqS/IxjgdiSB9Paii
p6Fp+8C3U0eAj4G4HgD3FC3twEJ8zsRgqCMHHGPSiihCbEF5OBkOB8vTaMfl0pByPxoopSKg9T//
2Q=="/>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button @click="submit" style="width: 100%;background-color:#e86429;color: white">登录</Button>
                </FormItem>
                </div>
            </Form>
        </Row>
    </div>
</template>
<script>


    export default {
        data(){
            return {
                login: {
                    username: null,
                    password: null,
                    captcha: null
                },
                title: null
                // rules: {
                //     name: [
                //         { required: true, message: "用户名不能为空", trigger: "blur" }
                //         // { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                //     ],
                //     passWord: [
                //         { required: true, message: "密码不能为空", trigger: "blur" }
                //     ],
                //     captcha: [
                //         { required: true, message: "验证码不能为空", trigger: "blur" }
                //     ],
                // }
            }
        },
        mounted(){
            this.getCode();
            this.systemType().then((resp) => {
                resp.data.data ? this.title = '伟思信安工业数据采集网闸系统-采集模块' : this.title = '伟思信安工业数据采集网闸系统-上报模块';
                // resp.data.data ? this.title = '伟思信安工业数据采集单向光闸系统-采集模块' : this.title = '伟思信安工业数据采集单向光闸系统-上报模块';
                this.$storage.setStorage("loginType", resp.data.data);
            });
        },
        methods: {
            getCode(){
                // this.$axios.get(this.$config.loginCode).then((response) => {
                this.$https.fetchGet(this.$api.user.captcha.url).then((response) => {
                    this.$refs.captcha.src = response.data.data;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            async systemType() {
                let res =  await this.$https.fetchGet(this.$api.global.url);
                return res;
            },
            submit(){
                this.$refs['plat_form'].validate((valid) => {
                    if (!valid)
                        return;
                    // if (true)
                    //     return;
                    this.$https.fetchPost(this.$api.user.login.url, this.login).then((response) => {
                        if (response.data.code == 200) {
                            // this.$storage.setStorage("user", "a");
                            this.$storage.setStorage("userName", response.data.data.principal.username);
                            this.$storage.setStorage("userUuid", response.data.data.principal.uuid);
                            // this.$router.push({path: "/sys"});
                            // this.$router.push({path: "/index/pandect"});
                            // this.$router.push({path: "/sys"});
                            if(response.data.data.authorities[0].authority == "系统管理员") {
                                this.$storage.setStorage("users", 'admins');
                                let data = this.$storage.getStorage("loginType")
                                console.log(data)
                                if(this.$storage.getStorage("loginType") == "false"){
                                    this.$router.push({path: "/sys/info/upload"});
                                }else{
                                    this.$router.push({path: "/sys"});
                                }
                            }else if(response.data.data.authorities[0].authority == "审计管理员") {
                                this.$storage.setStorage("users", 'logauditor');
                                this.$router.push({path: "/logs"});
                            }else if(response.data.data.authorities[0].authority == "安全管理员") {
                                this.$storage.setStorage("users", 'usermanager');
                                this.$router.push({path: "/user"});
                            }
                        } else {
                            this.$Notice.error({
                                title: "登录失败",
                                desc: response.data.describe
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                });
            }
        }
    }
</script>
<style scoped>

    .layout {
        background: url("../assets/login/login_bg_01.png") no-repeat;
        background-size: 105%;
        background-position: 100%;

        position: absolute;
        overflow: auto;
        height: 100%;
        width: 100%;
    }

    .layout1 {
        /*background: url("../assets/login/login_logo.png") no-repeat;*/
        background: url("../assets/login/logo.png") no-repeat;
        background-size: 85%;
        display: table;
        /*height: 160px;*/
        /*width: 220px;*/
        height: 130px;
        width: 170px;
        margin: 70px auto 0;
    }

    .layout2 {
        height: 360px;
        margin: 20px 0 100px;
        background: url("../assets/login/login_bg_02.png") no-repeat;
        /*background-size: 100% 360px;*/
        background-size: 100% 300px;
    }

    .form-control {
        display: block;
        width: 100%;
        height: 34px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }
</style>
