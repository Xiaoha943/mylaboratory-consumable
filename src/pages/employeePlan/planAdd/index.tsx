/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Card, Form, Button, Input, Row, Col, Select, Space, Table,DatePicker} from "antd";
import { EmptyView } from "@/components/EmptyView";
import { apiSystemRoleQueryPage, Role } from "@/api/apis/system";
import { useAntdTable } from "ahooks";
import { PaginatedParams } from "ahooks/lib/useAntdTable";
import { ColumnsType } from "antd/lib/table";
import { DeletePopconfirm } from "@/components/Popconfirm";
import { DataSourceItem } from "@/components/Field/Eselect";
import moment from 'moment';
import { useGetDataDictionary,useModal } from "@/hooks";
import { OperateType } from "@/types";
import  {Detail} from './Detail'
import { current } from "@reduxjs/toolkit";

const { Option, OptGroup } = Select;
const {RangePicker} = DatePicker;
const dateFormat ='yyyy-MM-DD'

const getColumns = (
  onEdit = (id: number) => { },
  onRomve = (id: number) => { },
  dataSource :DataSourceItem[]
): ColumnsType<any> => {
  return [
    {
      title: "编制数量",
      dataIndex: "hcPlanTotal",
    },
    {
      title: "计划日期",
      dataIndex: "yearPlanTimeStart",
    },
    {
      title: "状态",
      dataIndex: "applySts",
      render:(text)=>(
        <span>{dataSource.find((v)=>v.value === text)?.label}</span>
      )
    },
    {
      title: "操作者",
      dataIndex: "startPlanUserName",
    },
    {
      title: "操作",
      dataIndex: "tableAction",
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => onEdit(record.id)}>修改</a>
          <DeletePopconfirm onClick={() => onRomve(record.id)} />
        </Space>
      ),
    },
  ];
};

// 表格数据
const data = [
  {
    id: 0,
    hcPlanTotal: '40',
    yearPlanTimeStart: '2022.01.01',
    applySts: 1,
    startPlanUserName: '韩静文',
  },
  {
    id: 1,
    hcPlanTotal: '10',
    yearPlanTimeStart: '2021.12.01',
    applySts: 1,
    startPlanUserName: '苏蕴涵',
  },
  {
    id: 2,
    hcPlanTotal: '60',
    yearPlanTimeStart: '2022.01.01',
    applySts: 2,
    startPlanUserName: '韩静文',
  },
]

// 下拉框数据
const partItems: any = [
  "已提交",
  "待审批",
  "审批通过",
]

/**
 * 若使用接口返回的数据调用方法
 * @param param0 
 * @param formData 
 * @returns 
 */
const getTableData = async (
  { current, pageSize }: PaginatedParams[0],
  formData: Partial<Role>
) => {
  //查询列表数据
  const params = { ...formData, pageNum: current, pageSize };
  // const res = await apiSystemRoleQueryPage(params);
  return {
    // list: res
  };
};

export default () => {
  const [form] = Form.useForm();
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
  });
  const {submit,reset} = search

  const [centers, setCenters] = React.useState([partItems]);

  const handlePartChange = (value: any) => {
    setCenters([value]);
   
  };
  const handleRemove = async (id: number) => {
    console.log('handleRemove');
  };
  const handleEdit =async (id:number) => {
    console.log('handleEdit')
  }

  useEffect(()=>{
    form.setFieldsValue(FormData)
  },[FormData])

  const [currentId,setCurrentId] = useState(0)
  const {visible ,confirmLoading,open,ok,close,operateType} = useModal()
  
  const handleCreate =()=>{
    setCurrentId(0);
    open(OperateType.Create)
  }
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onChange = (date:any, dateString:any)=>{
    console.log(date, dateString);
  }

  return (
    <>
      <Card bordered={false}>
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="applySts" label="状态" >
                <Select style={{ width: 240 }} onChange={handlePartChange}>
                  {partItems.map((item: any,index:number) => (
                    <Option key={index} value={item}>{item}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="applySts" label="状态">
               <Select style={{width:240}}>
                 <option value="0">审批中</option>
                 <option value="1">已完成</option>
                 <option value="2">否决</option>
               </Select>
               </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="yearPlanTime" label="计划日期">
                    <RangePicker
                     defaultValue={[moment('2021/01/01',dateFormat),moment('2021/01/01',dateFormat)]}
                     format={dateFormat}
                    />
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: "right" }}>
              <Space>
                <Button type="primary" htmlType="submit" onClick={submit}>
                  搜索
                </Button>
                <Button onClick={reset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      <EmptyView />
      <Card bordered={false}>
        <Space>
          {/* <Button type="primary" onClick={}> */}
          <Button type="primary" onClick={handleCreate}>
            新建
          </Button>
          {/* <Button onClick={} disabled={isDisabled}> */}
          <Button >
            删除
          </Button>
        </Space>
        <EmptyView />
        <Table columns={getColumns(handleEdit,handleRemove,[
          {
            label:'审批中',
            value:0
          },
          {
            label:'已完成',
            value:1
          },
          {
            label:'否决',
            value:2
          }
        ])} dataSource={data} rowKey ='id' >
        </Table>
      </Card>
      <Detail
      visible={visible}
      onRefresh ={submit}
      operateType ={operateType}
      confirmLoading ={confirmLoading}
      onClose ={close}
      id={currentId}
      onOk={ok}
      />
    </>
  );
};
