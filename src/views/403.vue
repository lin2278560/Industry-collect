<template>
    <div style="margin-top: 10px;">
        <h1 style="text-align: center;margin-bottom: 15px;">403 Forbidden</h1>
        <p style="text-align: center;margin-top: 10px;">openresty/1.13.6.1</p>
        <div style="text-align: center;margin-top:30px">
            <i-button style="text-align: center;margin-top: 10px;" type="warning" label="large"  @click="back()">返回上一页</i-button>
        </div>
        
    </div>
</template>

<script>
    export default {
        name: "403",
        methods: {
            back(){
                if (window.history.length <= 1) {
                    this.$router.push({path:'/'})
                    return false
                } else {
                    this.$router.go(-1)
                }
            }
        },
    }
</script>

<style scoped>

</style>