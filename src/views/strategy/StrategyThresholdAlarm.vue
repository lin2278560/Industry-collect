<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body">
                <div style="width:100%;position:relative;float: left;margin-top: 20px;">
                    <!-- <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">当前版本信息</span> -->
                    
                    <!-- 阈值警告栏 -->
                    <!-- <div class="agile-list">
                        <div style="width: 26%;display:inline-block;" class="warning-element">
                            <img style="width:12%;height:12%;" src="../../assets/images/警告.png" />
                            <span style="float:right;line-height:18px;">阈值超过<strong>预警值</strong>产生<strong>一般告警</strong></span>
                            <span style="float:right;line-height:2px;font-size:12px;">(预警值请小于风险值)</span>
                        </div>
                        <div style="width: 26%;display:inline-block;margin-left:15px;" class="danger-element">
                            <img style="width:12%;height:12%;" src="../../assets/images/警告 (1).png" />
                            <span style="float:right;line-height:36px;">阈值超过<strong>风险值</strong>产生<strong>严重告警</strong></span>
                        </div>
                    </div> -->
                    
                    <!-- <div class="agile-list">
                        <div style="width: 13%;display:inline-block;" class="warning-element">
                            <img style="width:24px;height:24px;" src="../../assets/images/警告.png" />
                            <span style="float:right;line-height:18px;"><strong>一般告警</strong></span>
                        </div>
                        <div style="width: 13%;display:inline-block;margin-left:15px;" class="danger-element">
                            <img style="width:24px;height:24px;" src="../../assets/images/警告 (1).png" />
                            <span style="float:right;line-height:18px;"><strong>严重告警</strong></span>
                        </div>
                    </div> -->
                </div>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 35px;" >
                                <th style="width: 10%;"><span style="float: right;margin-right: 15px;font-size: 12px;"></span></th>
                                <th colspan="2"><span style="width: 45%;">采集系统</span></th>
                                <th colspan="2"><span style="width: 45%;">上报系统</span></th>
                            </tr>
                            <tr style="height: 35px;" >
                                <td><span style="font-weight:bold;width: 10%;font-size:12px;">CPU利用率</span></td>
                                <!-- <td><span style="font-size: 12px;">预警: 
                                <Input v-model="form.collectWarnCpu" style="width:65%;" >
                                    <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">%</span>
                                </Input></span></td> -->
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectWarnCpu" class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectWarnCpu" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;">&nbsp;% &nbsp;&nbsp;</span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <!-- <td><span style="font-size: 12px;">风险: 
                                <Input v-model="form.collectRiskCpu" style="width:65%;" >
                                    <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;"> % </span>
                                </Input></span>
                                </span></td>
                                <td> -->
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectRiskCpu" class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectRiskCpu" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadWarnCpu" class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadWarnCpu" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.uploadWarnCpu" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                        <span slot="suffix" style="line-height:32px;"> % </span>
                                    </Input>
                                    </span>
                                </td> -->
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.uploadRiskCpu" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;"> % </span>
                                </Input>
                                    </span>
                                </td> -->
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadRiskCpu" class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadRiskCpu" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                            </tr>
                            <tr style="height: 35px;" >
                                <td><span style="font-weight:bold;width: 10%;font-size:12px;">内存利用率</span></td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.collectWarnMem" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;"> % </span>
                                </Input>
                                    </span>
                                </td> -->
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectWarnMem" class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectWarnMem" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.collectRiskMem" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;"> % </span>
                                </Input>
                                    </span>
                                </td> -->
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectRiskMem" class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectRiskMem" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.uploadWarnMem" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;"> % </span>
                                </Input>
                                    </span>
                                </td> -->
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadWarnMem" class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadWarnMem" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadRiskMem" class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadRiskMem" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.uploadRiskMem" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;"> % </span>
                                </Input>
                                    </span>
                                </td> -->
                            </tr>
                            <tr style="height: 35px;" >
                                <td><span style="font-weight:bold;width: 10%;font-size:12px;">磁盘利用率</span></td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.collectWarnDisk" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;"> % </span>
                                </Input>
                                        </span>
                                </td> -->
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectWarnDisk" class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectWarnDisk" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectRiskDisk" class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectRiskDisk" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.collectRiskDisk" style="width:65%;" >
                                            <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;"> % </span>
                                </Input>
                                        </span>
                                </td> -->
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadWarnDisk" class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadWarnDisk" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <td>
                                <span style="font-size: 12px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadRiskDisk" class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadRiskDisk" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> % &nbsp;&nbsp;</span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.uploadWarnDisk" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">%</span>
                                </Input>
                                    </span>
                                </td>
                                <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.uploadRiskDisk" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">%</span>
                                </Input>
                                    </span>
                                </td> -->
                            </tr>
                            <tr style="height: 35px;" >
                                <td><span style="font-weight:bold;width: 10%;font-size:12px;">上行流量</span></td>
                                <td>
                                <span style="font-size: 12.5px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectWarnUpFlow" :max=10240 class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectWarnUpFlow" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> KB </span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <td>
                                <span style="font-size: 12.5px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectRiskUpFlow" :max=10240 class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectRiskUpFlow" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> KB </span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.collectWarnUpFlow" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">KB</span>
                                </Input>
                                        </span>
                                </td>
                                <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.collectRiskUpFlow" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">KB</span>
                                </Input>
                                        </span>
                                </td> -->
                                <td>
                                <span style="font-size: 12.5px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadWarnUpFlow" :max=10240 class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadWarnUpFlow" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> KB </span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <td>
                                <span style="font-size: 12.5px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadRiskUpFlow" :max=10240 class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadRiskUpFlow" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> KB </span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.uploadWarnUpFlow" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">KB</span>
                                </Input>
                                        </span>
                                </td>
                                <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.uploadRiskUpFlow" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">KB</span>
                                </Input>
                                        </span>
                                </td> -->
                            </tr>
                            <tr style="height: 35px;" >
                                <td><span style="font-weight:bold;width: 10%;font-size:12px;">下行流量</span></td>
                                <td>
                                <span style="font-size: 12.5px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectWarnDownFlow" :max=10240 class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectWarnDownFlow" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> KB </span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <td>
                                <span style="font-size: 12.5px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.collectRiskDownFlow" :max=10240 class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.collectRiskDownFlow" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> KB </span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.collectWarnDownFlow" style="width:65%;" >
                                        <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">KB</span>
                                </Input>
                                        </span>
                                </td>
                                <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.collectRiskDownFlow" style="width:65%;" >
                                                <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">KB</span>
                                </Input>
                                        </span>
                                </td> -->
                                <td>
                                <span style="font-size: 12.5px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadWarnDownFlow" :max=10240 class="warningSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadWarnDownFlow" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> KB </span>
                                <!-- &nbsp;&nbsp;&nbsp;&nbsp;<strong>预警</strong> -->
                                <Tag color="warning">预警</Tag>
                                </span>
                                </td>
                                <td>
                                <span style="font-size: 12.5px;">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <span style="width:25%;">
                                    <Slider v-model="form.uploadRiskDownFlow" :max=10240 class="dangerSlider" style="margin-left:5%;width:38%;float:left;"></Slider>
                                </span>
                                <Input v-model="form.uploadRiskDownFlow" style="width:22%;margin-top:2px;" />
                                <span slot="suffix" style="line-height:32px;"> KB </span>
                                <Tag color="error">风险</Tag>
                                <!-- &nbsp;&nbsp;<strong>风险</strong> -->
                                </span>
                                </td>
                                <!-- <td>
                                    <span style="font-size: 12px;">
                                        预警: <Input v-model="form.uploadWarnDownFlow" style="width:65%;" >
                                              <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">KB</span>
                                </Input>  
                                        </span>
                                </td>
                                <td>
                                    <span style="font-size: 12px;">
                                        风险: <Input v-model="form.uploadRiskDownFlow" style="width:65%;" >
                                              <img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (8).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">KB</span>
                                </Input>  
                                        </span>
                                </td> -->
                            </tr>
                            <tr style="height: 35px;" >
                                <td><span style="font-weight:bold;width: 10%;font-size:12px;">数据冻结时长</span></td>
                                <td colspan="4">
                                <!-- <span style="font-size: 12px;">预警: <Input v-model="form.freezeWarnTime" style="width:32.5%;" ><img style="width:14px;height:13px;margin:8.5px 0 0 4px" src="../../assets/images/警告 (7).png" slot="prefix">
                                    <span slot="suffix" style="line-height:32px;">秒</span>
                                </Input>
                                </span> -->
                                
                                <span style="font-size: 12px;">
                                <!-- <img style="width:28px;height:28px;margin:3px" src="../../assets/images/告警9.png" slot="prefix"> -->
                                <Input v-model="form.freezeWarnTime" style="width:12.5%;" />
                                <span slot="suffix" style="line-height:32px;margin-right:10px;">&nbsp;&nbsp;秒</span>
                                <Tag color="warning">预警</Tag>
                                </span>
                                <span style="font-size: 12px;margin-left:25%">
                                <!-- <img style="width:24px;height:24px;margin:3px" src="../../assets/images/危险9.png" slot="prefix"> -->
                                <Input v-model="form.freezeRiskTime" style="width:12.5%;" />
                                <span slot="suffix" style="line-height:32px;margin-right:10px;">&nbsp;&nbsp;秒</span>
                                <Tag color="error">风险</Tag>
                                </span>
                                
                                
                                </td>
                                <!-- <td colspan="2">

                                <span style="font-size: 12px;">
                                <Input v-model="form.freezeRiskTime" style="width:12.5%;" />
                                <span slot="suffix" style="line-height:32px;">&nbsp;&nbsp;秒</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>风险</strong>
                                </span>
                                </td> -->
                            </tr>
                            <tr style="height: 35px;" >
                                <td><span style="font-weight:bold;width: 10%;font-size:12px;">是否开启</span></td>
                                <td colspan="4"><span style="font-size: 12px;">
                                    <i-switch style="margin-left:12px" v-model="form.status" @on-change="checkstatus" size="large">
                                        <span slot="open">开启</span>
                                        <span slot="close">关闭</span>
                                    </i-switch></span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div style="margin: 10px 0 10px 50%;" >
                    <Button style="margin-right:10px;" @click="reset">重置</Button>
                    <Button type="primary" @click="submit()">确定</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        inject: ["reload"],
        name: "StrategyThresholdAlarm",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                data: null,
                url: '',
                file: null,
                loading: false,
                links: [
                    {name: "阈值告警", to: "/strategy/thresholdAlarm"},
                    {name: "采集阈值", to: "/strategy/collectThresholdAlarm"},
                    {name: "上报阈值", to: "/strategy/uploadThresholdAlarm"},
                ],
                form:{
                    collectRiskCpu: 0,
                    collectRiskDisk: 0,
                    collectRiskDownFlow: 0,
                    collectRiskMem: 0,
                    collectRiskUpFlow: 0,
                    collectWarnCpu: 0,
                    collectWarnDisk: 0,
                    collectWarnDownFlow: 0,
                    collectWarnMem: 0,
                    collectWarnUpFlow: 0,
                    status: true,
                    uploadRiskCpu: 0,
                    uploadRiskDisk: 0,
                    uploadRiskDownFlow: 0,
                    uploadRiskMem: 0,
                    uploadRiskUpFlow: 0,
                    uploadWarnCpu: 0,
                    uploadWarnDisk: 0,
                    uploadWarnDownFlow: 0,
                    uploadWarnMem: 0,
                    uploadWarnUpFlow: 0,
                    freezeWarnTime: 60,
                    freezeRiskTime: 300,
                }
            }
        },
        created() {
            // var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
            // this.showData();
        },
        mounted: function() {
            this.getinfo()
        },
        methods: {
            checkstatus(){
                
            },
            isRealNum(val){
                // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
            　　if(val === "" || val ==null){
                    return false;
            　　}
                if(!isNaN(val)){　　　　
            　　//对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
                //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
            　　　 return true; 
            　　}
            　  else{ 
            　　　　return false; 
            　　} 
            },
            //清除对象数据
            clearParams(params){
                if(!(typeof (params) == 'object')) return;
                Object.keys(params).forEach((val,index,arr)=>{
                params[val] = '';
                });
                return params;
            },
            //检查对象数据
            clearParams(params){
                if(!(typeof (params) == 'object')) return;
                Object.keys(params).forEach((val,index,arr)=>{
                // params[val] = '';
                let flag = isNaN(params[val])
                    if(!flag){
                        this.$Notice.error({title: '修改失败', desc: '请填写数字', duration: 2.5});
                        return
                    }
                });
            },
            //重置
            reset(){
                this.$Notice.success({title: '重置成功', duration: 2.5});
                //this.clearParams(this.form)
                let form={
                    collectRiskCpu: 90,
                    collectRiskDisk: 90,
                    collectRiskDownFlow: 5500,
                    collectRiskMem: 90,
                    collectRiskUpFlow: 5500,
                    collectWarnCpu: 80,
                    collectWarnDisk: 80,
                    collectWarnDownFlow: 4500,
                    collectWarnMem: 80,
                    collectWarnUpFlow: 4500,
                    status: true,
                    uploadRiskCpu: 90,
                    uploadRiskDisk: 90,
                    uploadRiskDownFlow: 5500,
                    uploadRiskMem: 90,
                    uploadRiskUpFlow: 5500,
                    uploadWarnCpu: 80,
                    uploadWarnDisk: 80,
                    uploadWarnDownFlow: 4500,
                    uploadWarnMem: 80,
                    uploadWarnUpFlow: 4500,
                    freezeWarnTime: 60,
                    freezeRiskTime: 300,
                }
                this.form = form
            },
            checkaction(){

            },
            getinfo() {
                this.$https.fetchGet(this.$api.strategy.thresholdInfo.url).then((resp) => {
                    this.form = resp.data.data;
                    console.log(this.form)
                }).catch(err => {
                    console.log(err)
                })
            },
            submit(){
                let params = this.form
                if(!(typeof (params) == 'object')) return;
                let flag = false
                try{
                    Object.keys(params).forEach((val,index,arr)=>{
                    flag = this.isRealNum(params[val])
                        if(!flag){
                            this.$Notice.error({title: '修改失败', desc: '所有数值请填写数字', duration: 10});
                            console.log(flag)
                            throw new Error("EndIterative");
                        }
                    });
                } catch(e){
                    if(e.message!="EndIterative") throw e;
                }
                if(!flag){
                    return
                }
                if(Number(this.form.collectRiskCpu) <= Number(this.form.collectWarnCpu)){
                    this.$Notice.error({title: '修改失败', desc: '采集系统CPU利用率风险值必须大于预警值', duration: 10});
                    return
                }else if(Number(this.form.collectRiskDisk) <= Number(this.form.collectWarnDisk)){
                    this.$Notice.error({title: '修改失败', desc: '采集系统磁盘利用率风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.collectRiskDownFlow) <= Number(this.form.collectWarnDownFlow)){
                    this.$Notice.error({title: '修改失败', desc: '采集系统接口下行流量风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.collectRiskMem) <= Number(this.form.collectWarnMem)){
                    this.$Notice.error({title: '修改失败', desc: '采集系统内存利用率风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.collectRiskUpFlow) <= Number(this.form.collectWarnUpFlow)){
                    this.$Notice.error({title: '修改失败', desc: '采集系统接口上行流量率风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.uploadRiskCpu) <= Number(this.form.uploadWarnCpu)){
                    this.$Notice.error({title: '修改失败', desc: '上报系统CPU利用率风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.uploadRiskDisk) <= Number(this.form.uploadWarnDisk)){
                    this.$Notice.error({title: '修改失败', desc: '上报系统磁盘利用率风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.uploadRiskDownFlow) <= Number(this.form.uploadWarnDownFlow) ){
                    this.$Notice.error({title: '修改失败', desc: '上报系统接口下行流量风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.uploadRiskMem) <= Number(this.form.uploadWarnMem)){
                    this.$Notice.error({title: '修改失败', desc: '上报系统内存利用率风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.uploadRiskUpFlow) <= Number(this.form.uploadWarnUpFlow)){
                    this.$Notice.error({title: '修改失败', desc: '上报系统接口上行流量率风险值必须大于预警值', duration: 10});
                    return
                }
                else if(Number(this.form.freezeRiskTime) <= Number(this.form.freezeWarnTime)){
                    this.$Notice.error({title: '修改失败', desc: '数据冻结时长风险值必须大于预警值', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectRiskCpu) || Number(this.form.collectRiskCpu) > 100){
                    this.$Notice.error({title: '修改失败', desc: '采集系统风险CPU利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectRiskDisk) || Number(this.form.collectRiskDisk) > 100){
                    this.$Notice.error({title: '修改失败', desc: '采集系统风险磁盘利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectRiskMem) || Number(this.form.collectRiskMem) > 100){
                    this.$Notice.error({title: '修改失败', desc: '采集系统风险内存利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectWarnCpu) || Number(this.form.collectWarnCpu) > 100){
                    this.$Notice.error({title: '修改失败', desc: '采集系统预警CPU利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectWarnDisk) || Number(this.form.collectWarnDisk) > 100){
                    this.$Notice.error({title: '修改失败', desc: '采集系统预警磁盘利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectWarnMem) || Number(this.form.collectWarnMem) > 100){
                    this.$Notice.error({title: '修改失败', desc: '采集系统预警内存利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadRiskCpu) || Number(this.form.uploadRiskCpu) > 100){
                    this.$Notice.error({title: '修改失败', desc: '上报系统风险CPU利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadRiskDisk) || Number(this.form.uploadRiskDisk) > 100){
                    this.$Notice.error({title: '修改失败', desc: '上报系统风险磁盘利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadRiskMem) || Number(this.form.uploadRiskMem) > 100){
                    this.$Notice.error({title: '修改失败', desc: '上报系统风险内存利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadWarnCpu) || Number(this.form.uploadWarnCpu) > 100){
                    this.$Notice.error({title: '修改失败', desc: '上报系统预警CPU利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadWarnDisk) || Number(this.form.uploadWarnDisk) > 100){
                    this.$Notice.error({title: '修改失败', desc: '上报系统预警磁盘利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadWarnMem) || Number(this.form.uploadWarnMem) > 100){
                    this.$Notice.error({title: '修改失败', desc: '上报系统预警内存利用率取值范围为0~100%', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectWarnUpFlow) || Number(this.form.collectWarnUpFlow) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '采集系统预警接口上行流量取值范围为0~10240KB', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadWarnUpFlow) || Number(this.form.uploadWarnUpFlow) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '上报系统预警接口上行流量取值范围为0~10240KB', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadRiskUpFlow) || Number(this.form.uploadRiskUpFlow) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '上报系统风险接口上行流量取值范围为0~10240KB', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectRiskUpFlow) || Number(this.form.collectRiskUpFlow) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '采集系统风险接口上行流量取值范围为0~10240KB', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectWarnDownFlow) || Number(this.form.collectWarnDownFlow) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '采集系统预警接口下行流量取值范围为0~10240KB', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.collectRiskDownFlow) || Number(this.form.collectRiskDownFlow) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '采集系统风险接口下行流量取值范围为0~10240KB', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadWarnDownFlow) || Number(this.form.uploadWarnDownFlow) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '上报系统预警接口下行流量取值范围为0~10240KB', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.uploadRiskDownFlow) || Number(this.form.uploadRiskDownFlow) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '采集系统风险接口下行流量取值范围为0~10240KB', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.freezeWarnTime) || Number(this.form.freezeWarnTime) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '数据冻结时长预警值取值范围为正整数', duration: 10});
                    return
                }
                else if( 0 > Number(this.form.freezeRiskTime) || Number(this.form.freezeRiskTime) > 10240){
                    this.$Notice.error({title: '修改失败', desc: '数据冻结时长风险值取值范围为正整数', duration: 10});
                    return
                }
                this.$https.fetchPost(this.$api.strategy.updateThresholdInfo.url,this.form).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '阈值告警修改成功', desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                            this.reload();
                        }, 250);
                    } else
                        this.$Notice.error({title: resp.data.title, desc: "错误：" + resp.data.describe, duration: 10});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 10});
                        console.log(err)
                    })
            },
        }
    }
</script>

<style scoped lang="less">
th{
    text-align: center !important;
}
td{
    text-align: center !important;
}
/deep/.ivu-input-prefix, .ivu-input-suffix {
    width: 22px;
    height: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
}
/deep/ .ivu-input-with-prefix {
    padding-left: 24px;
}
.agile-list {
            list-style: none;
            margin: 0;
        }
        
        .agile-list div {
            background: #fff;
            border: 1px solid #e7eaec;
            margin: 0px 0 10px 0;
            padding: 10px;
            border-radius: 2px;
        }
        
        .agile-list div:hover {
            /* cursor: pointer; */
            background: #FAFAFB;
        }
        
        .agile-detail {
            margin-top: 5px;
            font-size: 12px;
        }
        
        .agile-list {
            list-style: none;
            margin: -5px 10px;
        }
        
        .agile-list div {
            background: #ffffff;
            border: 1px solid #e7eaec;
            margin: 0px 0 20px 0;
            padding:20px 10px;
            border-radius: 2px;
        }
        
        .agile-list div:hover {
            /* cursor: pointer; */
            background: #fff;
        }
        
        .agile-list div.warning-element {
            border-left: 5px solid #e66534;
        }
        
        .agile-list div.danger-element {
            border-left: 5px solid #d81e06;
        }
        .warningSlider{
            /deep/ .ivu-slider-bar {
                height: 4px;
                background: #ffa927;
                border-radius: 3px;
                position: absolute;
            }
            /deep/ .ivu-slider-button {
                width: 12px;
                height: 12px;
                border: 2px solid #ffa927;
                border-radius: 50%;
                background-color: #fff;
                -webkit-transition: all 0.2s linear;
                transition: all 0.2s linear;
                outline: 0;
            }
        }
        .dangerSlider{
            /deep/ .ivu-slider-bar {
                height: 4px;
                background: #ed4014;
                border-radius: 3px;
                position: absolute;
            }
            /deep/ .ivu-slider-button {
                width: 12px;
                height: 12px;
                border: 2px solid #ed4014;
                border-radius: 50%;
                background-color: #fff;
                -webkit-transition: all 0.2s linear;
                transition: all 0.2s linear;
                outline: 0;
            }
        }
</style>
