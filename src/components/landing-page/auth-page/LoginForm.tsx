"use client";
import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "../../../lib/util";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginSchemas } from "../../../schemas";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

interface LoginFormValues {
  email: string;
  password: string;
  checked: boolean;
}

export function LoginForm({
  errorCall,
  setShowForgotPassword,
}: {
  errorCall: (data: boolean) => void;
  setShowForgotPassword: (show: boolean) => void;
}) {
  const navigate = useNavigate();
  const handleLogin = async (values: LoginFormValues, actions: any) => {
    try {
      const checkAccountResponse = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/check-user-active/${
          values.email
        }`
      );
      const accountStatus = await checkAccountResponse.json();

      console.log("account", accountStatus)

      console.log(accountStatus.data[0].isActive )

      if (accountStatus.data[0].isActive === 1) {
        const response = await axios.post(`${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/login`,values);
        let responseData = response.data;

        console.log("response", responseData)

        if (responseData.message === "Record not found") {
          errorCall(true);
        } else {
          Swal.fire("Berhasil", "Anda berhasil login", "success")
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              name: responseData.data.name,
            })
          );
          actions.resetForm();
          navigate("/beranda");
          localStorage.setItem("token", responseData.data.token);
          const updatedData = {
            ...responseData.data,
            timestamp: new Date().getTime()
          };
          const userData = updatedData;
    

          localStorage.setItem("userData", JSON.stringify(userData));
        }
      } else {
         Swal.fire("Error!", "Status akunmu non aktif", "error")
      }
    } catch (error) {
      errorCall(true);
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      checked: false,
    },
    validationSchema: LoginSchemas,
    onSubmit: handleLogin,
  });

  return (
    <div className="max-w-sm sm:max-w-md w-full mx-4 sm:mx-auto rounded-2xl p-4 md:p-8 shadow-lg bg-white backdrop-blur-3xl dark:bg-black">
      <h2 className="font-bold sm:text-xl text-neutral-800 dark:text-neutral-200">
        Selamat Datang di
      </h2>
      <h2 className="font-bold md:text-xl text-neutral-800 dark:text-neutral-200">
        Scaling Yourself App
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Silahkan masukkan akun Anda
      </p>

      <form className="my-4 sm:my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Masukkan Email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.email && touched.email
                ? "border-2 border-red-400 focus-visible:ring-red-400"
                : "border-none file:border-0"
            }
          />
          {touched.password && (
            <p className="ml-2 text-red-400 text-sm max-w-sm">{errors.email}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Kata Sandi</Label>
            <div className="flex justify-end items-center mb-4">
              <button
                type="button"
                className="text-sm font-medium text-blue-500"
                onClick={() => setShowForgotPassword(true)}
              >
                Lupa Password?
              </button>
            </div>
          </div>
          <Input
            id="password"
            placeholder="Masukkan Kata Sandi"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.password && touched.password
                ? "border-2 border-red-400 focus-visible:ring-red-400"
                : "border-none file:border-0"
            }
          />
          {touched.password && (
            <p className="ml-2 text-red-400 text-sm max-w-sm">
              {errors.password}
            </p>
          )}
        </LabelInputContainer>

        <div className="flex flex-col justify-center items-center gap-y-4">
          <button
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "opacity-[0.35]" : ""
            } bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
            type="submit"
          >
            Masuk
            <BottomGradient />
          </button>

          <p className="text-sm">
            Belum Punya Akun?{" "}
            <Link className="text-blue-500" to="/register">
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
