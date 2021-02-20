<template>
<div>
    <Button style="float: right;" size="small" @click="addNode('add')">新建节点</Button>

    <Modal
            title="节点信息"
            v-model="show" @on-ok="okAddNode"
            class-name="vertical-center-modal" width="800">
        <input hidden v-model="modal11.state" />
        <contentTabs :links="NodeInfo"></contentTabs>
    </Modal>
</div>
</template>

<script>
    export default {
        name: "NodeConfigAdd"
    }
</script>

<style scoped>

</style>