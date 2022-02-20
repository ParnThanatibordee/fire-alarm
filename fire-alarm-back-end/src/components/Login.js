import React, { useEffect, useState } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import Form from "react-bootstrap/Form"
import { Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFire } from "@fortawesome/free-solid-svg-icons"

const Login = () => {
  const [details, setDetails] = useState({ email: "", password: "" })
  const [accessToken, setAccessToken] = useState("")
  const [typeToken, setTypeToken] = useState("")

  useEffect(() => {
    window.localStorage.setItem("typetoken", typeToken)
    window.localStorage.setItem("accesstoken", accessToken)
  }, [typeToken, accessToken])

  const handleSubmitClick = async (e) => {
    e.preventDefault()

    const loginFormData = new FormData()
    loginFormData.append("username", details.email)
    loginFormData.append("password", details.password)
    try {
      // make axios post request
      const response = await axios({
        method: "post",
        url: "https://ecourse.cpe.ku.ac.th/exceed15/api/login",
        data: loginFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      setAccessToken(response.data.access_token)
      setTypeToken(response.data.token_type)
      if (response.status === 200) {
        window.location.replace("/dashboard")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="loginPage">
      <h1 className="text-center text-white pt-5 login-header">
        <FontAwesomeIcon
          className="fa fa-cog fa-fw"
          icon={faFire}
          color="orange"
        />
        Fire Alarm
      </h1>
      <div id="login">
        <div className="container">
          <div
            id="login-row"
            className="row justify-content-center align-items-center"
          >
            <div id="login-column" className="col-md-6">
              <div id="login-box" className="col-md-12">
                <Form>
                  <h4 className="loginform-header">Sign in</h4>
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
                  {/* <div>Don't have an account?</div>
                                    <Row className="mb-3">
                                        <Link to="/signup">Sign up</Link>
                                    </Row> */}
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
