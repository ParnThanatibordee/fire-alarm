import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
import { Button, Row } from 'react-bootstrap'

const Login = () => {
    const [details, setDetails] = React.useState({ email: '', password: '' })
    const handleSubmitClick = async (e) => {
        e.preventDefault()
        console.log(details)
    }
    return (
        <div className="loginPage">
            <h1 className="text-center text-white pt-5">Fire Alarm</h1>
            <div id="login">
                <div className="container">
                    <div
                        id="login-row"
                        className="row justify-content-center align-items-center"
                    >
                        <div id="login-column" className="col-md-6">
                            <div id="login-box" className="col-md-12">
                                <Form>
                                    <h4>Sign in</h4>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="name@example.com"
                                            onChange={(e) =>
                                                setDetails({ ...details, email: e.target.value })
                                            }
                                            value={details.email}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            onChange={(e) =>
                                                setDetails({ ...details, password: e.target.value })
                                            }
                                            value={details.password}
                                        />
                                    </Form.Group>
                                    <div>Don't have an account?</div>
                                    <Row className="mb-3">
                                        <Link to="/signup">Sign up</Link>
                                    </Row>
                                    <Button
                                        variant="success"
                                        type="submit"
                                        onClick={handleSubmitClick}
                                    >
                                        Sign in
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login