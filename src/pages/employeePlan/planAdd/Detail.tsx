import React,{useEffect,useState,ReactText} from 'react';
import {Form,Input,Modal,InputNumber,Select,Row,Col,DatePicker} from 'antd'
import { useDispatch } from 'react-redux';
import { ModalOk } from '@/hooks';
import { OperateType } from '@/types';
import produce from 'immer';
import { createScanner } from 'typescript';
import { clearFormValue,
        createOrUpdate,
        getFormValue, 
        setFormValue } from './store';
import { Role } from '@/api/apis/system';

interface DetailProps{
    id?:number;
    confirmLoading:boolean;
    onClose:()=>void;
    onOk:ModalOk;
    onRefresh:()=>void;
    visible:boolean;
    operateType:OperateType;
}
const layout ={
    labelCol:{span:20},
    warpperCol:{span:22},
}
export const Detail:React.FC<DetailProps> =({
    onClose,
    onOk,
    visible,
    operateType,
    id,
    confirmLoading,
    onRefresh,
})=>{
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const formVlaue ={};

    const [checkedKeys,setCheckedKeys] =useState<ReactText[]>([]);
    useEffect(()=>{
        if(visible&&operateType !== OperateType.Create && id){
            dispatch(getFormValue(id));
        }
    },[id,operateType,visible])

    useEffect(()=>{
        form.setFieldsValue(formVlaue);
        dispatch(setFormValue(formVlaue));
    },[formVlaue])

    const handleOk =async ()=>{
        try{
            const formVlaue =await form.validateFields();
            const params = produce (formVlaue ,(data:Role)=>{
                data.menuIds =checkedKeys as number[];
            })
            const isSuccess =await createOrUpdate(params,id);
            if(isSuccess){
                form.resetFields();
                dispatch (clearFormValue());
                setCheckedKeys([]);
                onRefresh();
            }
            return isSuccess;
        }catch(error){
            console.error(error);
            return false;
        }
    }

    const close =()=>{
       onClose()
    }
    return(
        <>
            <Modal
            getContainer ={false}
            title="新增计划"
            visible={visible}
            onOk={onOk(handleOk)}
            confirmLoading ={confirmLoading}
            width={1200}
            afterClose={close}
            onCancel={close}
            >
                <Form 
                form={form}
                {...layout}
                layout="vertical">
                    <Row gutter={24}>
                        <Col span={6}>
                        <Form.Item label ='编制计划名称' name="orgPlanName">
                            <input  placeholder=''/>
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                        <Form.Item label ='年度总计划人数' name="hcPlanTotal">
                            <input  placeholder=''/>
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='编制计划录入时间' name="yearPlanTimeStart">
                                <DatePicker style={{width:275}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='编制计划结束时间' name="yearPlanTimeEnd">
                                <DatePicker style={{width:275}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item label="部门">
                                <Select>
                                    <Select.Option value="100">研发交付部</Select.Option>
                                    <Select.Option value="101">综合管理部</Select.Option>
                                    <Select.Option value="102">财务管理部</Select.Option>
                                    <Select.Option value="103">客户运营部</Select.Option>
                                    <Select.Option value="104">云基础架构部</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="团队">
                                <Select>
                                    <Select.Option value="100">研发团队</Select.Option>
                                    <Select.Option value="101">测试团队</Select.Option>
                                    <Select.Option value="102">产品团队</Select.Option>
                                    <Select.Option value="103">运维支持团队</Select.Option>
                                    <Select.Option value="104">人力资源团队</Select.Option>
                                    <Select.Option value="104">技术管理团队</Select.Option>
                                    <Select.Option value="104">项目交付团队</Select.Option>
                                    <Select.Option value="104">客户运营团队</Select.Option>
                                    <Select.Option value="104">财务管理团队</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="岗位">
                                <Select>
                                    <Select.Option value="100">java开发工程师</Select.Option>
                                    <Select.Option value="101">前端开发工程师</Select.Option>
                                    <Select.Option value="102">测试工程师</Select.Option>
                                    <Select.Option value="103">产品</Select.Option>
                                    <Select.Option value="104">运维工程师</Select.Option>
                                    <Select.Option value="104">技术管理工程师</Select.Option>
                                    <Select.Option value="104">云架构工程师</Select.Option>
                                    <Select.Option value="104">HR</Select.Option>
                                    <Select.Option value="104">客户运营岗</Select.Option>
                                    <Select.Option value="104">财务运营岗</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="级别">
                                <Select>
                                    <Select.Option value="0">初级</Select.Option>
                                    <Select.Option value="1">中级</Select.Option>
                                    <Select.Option value="2">高级</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item label="数量"name="applyUserName">
                               <Input placeholder=''/>
                            </Form.Item>
                        </Col>
                    </Row>
                    
                </Form>
            </Modal>
        </>
    )
}
Detail.defaultProps ={
    confirmLoading:false,
    visible:false,
    operateType:OperateType.Create,

}as DetailProps;