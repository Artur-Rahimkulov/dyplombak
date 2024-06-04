import { Button, Card, Checkbox, ConfigProvider, Form, Input, Progress, message } from 'antd';
import 'react-reflex/styles.css';
import { useEffect, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { CheckCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import authStore from '../../store/auth.store';
import { Navigate, useNavigate } from 'react-router-dom';
/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */
interface Props {
}
function Login(props: Props) {
    const navigate = useNavigate()
    const [register, setRegister] = useState<boolean>(false)
    const onFinish = (values: any) => {
        console.log(values)
        if (register)
            authStore.signup(values.username, values.password, () => navigate(-1))
        else
            authStore.login(values.username, values.password, () => navigate(-1))
    };

    const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        message.info('Регистрируйтесь заново 🙂')
    };

    const handleRegister = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setRegister(!register)
    };
    return authStore.isAuth ? <Navigate to='/' /> : <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        }}
    >
        <Card style={{ width: 500 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Title level={2}>Читай быстрее</Title>
            </div>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true, password: '1' }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: "Введите имя пользователя!" }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Имя пользователя"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                // rules={[{ required: true, message: "Введите пароль!" }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Пароль"
                    />
                </Form.Item>
                {!register && (<a
                    style={{ float: "right" }}
                    className="login-form-forgot"
                    href=""
                    onClick={handleForgotPassword}
                >
                    Забыли пароль?
                </a>)}
                {register && (<Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Подтвердите пароль!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<CheckCircleOutlined className="site-form-item-icon" />}
                        type="Confirm"
                        placeholder="Подтвердите пароль"
                    />

                </Form.Item>
                )}

                {!register && (<Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Запомнить меня</Checkbox>
                    </Form.Item>
                </Form.Item>)}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        block
                    >
                        {register ? 'Регистрация' : 'Войти'}
                    </Button>
                    {register ? 'Есть аккаунт' : 'Нет аккаунта'}{" "}
                    <a href="" onClick={handleRegister}>
                        {register ? 'Войти' : 'Регистрация'}
                    </a>
                </Form.Item>
            </Form>
        </Card>
    </div>
}

export default observer(Login);
