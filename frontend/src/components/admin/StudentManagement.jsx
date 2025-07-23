import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Select, Form, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStudent, setEditingStudent] = useState(null);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalVisible(true);
    setEditingStudent(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setIsModalVisible(true);
    setEditingStudent(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      department: record.department,
      year: record.year,
    });
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // Implement delete API call here
      const updatedStudents = students.filter(student => student.id !== id);
      setStudents(updatedStudents);
      message.success('Student deleted successfully');
    } catch (error) {
      message.error('Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (editingStudent) {
        // Implement update API call here
        const updatedStudents = students.map(student => 
          student.id === editingStudent.id ? { ...student, ...values } : student
        );
        setStudents(updatedStudents);
        message.success('Student updated successfully');
      } else {
        // Implement create API call here
        const newStudent = {
          id: Date.now(),
          ...values
        };
        setStudents([...students, newStudent]);
        message.success('Student added successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Implement fetch students API call here
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockStudents = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            department: 'Computer Science',
            year: '2nd Year'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            department: 'Electronics',
            year: '3rd Year'
          }
        ];
        setStudents(mockStudents);
      } catch (error) {
        message.error('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Student
        </Button>
      </div>
      
      <Table
        dataSource={students}
        columns={columns}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter student name' }]}
          >
            <Input placeholder="Enter student name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter student email' }]}
          >
            <Input placeholder="Enter student email" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <Select placeholder="Select department">
              <Option value="Computer Science">Computer Science</Option>
              <Option value="Electronics">Electronics</Option>
              <Option value="Mechanical">Mechanical</Option>
              <Option value="Civil">Civil</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: 'Please select year' }]}
          >
            <Select placeholder="Select year">
              <Option value="1st Year">1st Year</Option>
              <Option value="2nd Year">2nd Year</Option>
              <Option value="3rd Year">3rd Year</Option>
              <Option value="4th Year">4th Year</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingStudent ? 'Update' : 'Create'}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => setIsModalVisible(false)}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentManagement;
