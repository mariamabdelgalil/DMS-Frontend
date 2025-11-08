/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  // useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../redux/features/authSlice";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Must be 6 characters minimum")
    .required("Required"),
  nid: Yup.string().length(14, "Must be 14 digits").required("Required"),
});

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const AuthForm = () => {
  const [pageType, setPageType] = useState<"login" | "register">("login");
  const isLogin = pageType === "login";
  // const isNonMobile = useMediaQuery("(min-width:900px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (values: any, onSubmitProps: any) => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const data = await res.json();
    onSubmitProps.resetForm();
    if (res.ok) setPageType("login");
    else alert(data.message || "Registration failed");
  };

  const handleLogin = async (values: any, onSubmitProps: any) => {
    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    onSubmitProps.resetForm();
    if (res.ok) {
      dispatch(setLogin({ user: data.user, token: data.token }));
      navigate("/dashboard");
    } else alert(data.message || "Login failed");
  };

  const handleFormSubmit = async (values: any, onSubmitProps: any) => {
    if (isLogin) await handleLogin(values, onSubmitProps);
    else await handleRegister(values, onSubmitProps);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f7f3ef",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "90%",
          maxWidth: "900px",
          borderRadius: "1rem",
          boxShadow: 4,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // responsive
        }}
      >
        {/* Left Column - Form Section */}
        <CardContent sx={{ flex: 1, p: "2.5rem" }}>
          <Typography
            fontWeight="bold"
            textAlign="center"
            fontSize="32px"
            color="#8B4513"
          >
            DocSimple
          </Typography>
          <Typography
            fontWeight="500"
            variant="h6"
            textAlign="center"
            color="grey"
            sx={{ mb: "1.5rem" }}
          >
            Welcome to DocSimple, Your Docs management made simple!
          </Typography>

          {/* Formik Form stays exactly the same */}
          <Formik
            initialValues={
              isLogin
                ? { email: "", password: "" }
                : { name: "", email: "", password: "", nid: "" }
            }
            validationSchema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box display="grid" gap="20px">
                  {!isLogin && (
                    <>
                      <TextField
                        label="Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                      <TextField
                        label="National ID"
                        name="nid"
                        value={values.nid}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.nid && Boolean(errors.nid)}
                        helperText={touched.nid && errors.nid}
                      />
                    </>
                  )}

                  <TextField
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 4,
                    mb: 2,
                    p: "0.8rem",
                    backgroundColor: "#8B4513",
                    "&:hover": {
                      backgroundColor: "#432008",
                    },
                  }}
                >
                  {isLogin ? "Login" : "Register"}
                </Button>

                <Typography
                  onClick={() => setPageType(isLogin ? "register" : "login")}
                  sx={{
                    textAlign: "center",
                    textDecoration: "underline",
                    color: "primary.main",
                    cursor: "pointer",
                  }}
                >
                  {isLogin
                    ? "Don’t have an account? Register here."
                    : "Already have an account? Login here."}
                </Typography>
              </form>
            )}
          </Formik>
        </CardContent>

        {/* Right Column - Image Section */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            backgroundImage:
              'url("https://images.unsplash.com/photo-1568844590215-b7d899a731b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Card>
    </Box>
  );
};

export default AuthForm;
