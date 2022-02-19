import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
import { Button, Row, Col } from 'react-bootstrap'

const SignUp = () => {
    const [details, setDetails] = React.useState({
        fullname: '',
        email: '',
        password: '',
        confirmpassword: '',
    })
    const handleSubmitClick = async (e) => {
        e.preventDefault()
        console.log(details)
    }

    return (
        <div className="loginPage">
            <div id="login">
                <h1 className="text-center text-white pt-5">Fire Alarm</h1>
                <div className="container">
                    <div
                        id="login-row"
                        className="row justify-content-center align-items-center"
                    >
                        <div id="login-column" className="col-md-6">
                            <div id="login-box" className="col-md-12">
                                <Form>
                                    <h4>Sign up</h4>

                                    <Form.Group controlId="formGridFullName">
                                        <Form.Label>Full name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Firstname Lastname"
                                            onChange={(e) =>
                                                setDetails({ ...details, fullname: e.target.value })
                                            }
                                            value={details.fullname}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mt-3" controlId="formGridEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="name@example.com"
                                            onChange={(e) =>
                                                setDetails({ ...details, email: e.target.value })
                                            }
                                            value={details.email}
                                        />
                                    </Form.Group>
                                    <Row className="mt-3 mb-3">
                                        <Form.Group as={Col} controlId="formGridPassword">
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

                                        <Form.Group as={Col} controlId="formGridConfirmPassword">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm Password"
                                                onChange={(e) =>
                                                    setDetails({
                                                        ...details,
                                                        confirmpassword: e.target.value,
                                                    })
                                                }
                                                value={details.confirmpassword}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <div>Already have an account?</div>
                                    <Row className="mb-3">
                                        <Link to="/login">Sign in</Link>
                                    </Row>
                                    <Button variant="success" type="submit" onClick={handleSubmitClick}>
                                        Sign up
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

export default SignUp