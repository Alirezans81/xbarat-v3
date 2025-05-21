"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useLoginSignupDialogStore } from "@/lib/front/stores/dialog";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countryCodes } from "@/constants/globals";
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";
import { useCreateUser, useLoginUser } from "@/api/user/hook";

export default function LoginSignupDialog() {
  const { open, setOpen, mode, setMode } = useLoginSignupDialogStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [loading, setLoading] = useState(false);

  const t = useTranslations("LoginSignupDialog");

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError(t("emailRequired"));
      return false;
    }

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setEmailError(t("invalidEmail"));
      return false;
    }

    setEmailError("");
    return true;
  };
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError(t("passwordRequired"));
      return false;
    }

    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]{8,}$/;
    if (!re.test(password)) {
      setPasswordError(t("passwordStrength"));
      return false;
    }

    setPasswordError("");
    return true;
  };
  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) {
      setConfirmPasswordError(t("confirmPasswordRequired"));
      return false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(t("passwordsDoNotMatch"));
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };
  const validateFirstName = (firstName: string) => {
    if (!firstName) {
      setFirstNameError(t("firstNameRequired"));
      return false;
    }

    setFirstNameError("");
    return true;
  };
  const validateLastName = (lastName: string) => {
    if (!lastName) {
      setLastNameError(t("lastNameRequired"));
      return false;
    }

    setLastNameError("");
    return true;
  };
  const validateCountryCode = (countryCode: string) => {
    if (!countryCode) {
      setCountryCodeError(t("countryCodeRequired"));
      return false;
    }

    setCountryCodeError("");
    return true;
  };
  const validatePhoneNumber = (phone: string, countryCode: string) => {
    const phoneNumber = parsePhoneNumberFromString(
      phone,
      countryCode as CountryCode
    );

    if (!phoneNumber) {
      setPhoneNumberError(t("phoneNumberRequired"));
      return false;
    }

    if (!phoneNumber.isValid()) {
      setPhoneNumberError(t("invalidPhoneNumber"));
      return false;
    }

    setPhoneNumberError("");
    return true;
  };

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setCountryCode(countryCodes[0].code);
    setPhoneNumber("");

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFirstNameError("");
    setLastNameError("");
    setCountryCodeError("");
    setPhoneNumberError("");
  };

  const loginUser = useLoginUser();
  const createUser = useCreateUser();

  const login = () => {
    setLoading(true);
    loginUser({
      user: {
        email,
        password,
      },
      onSuccess() {
        setOpen(false);
      },
      onFinally() {
        setLoading(false);
      },
    });
  };
  const signup = () => {
    setLoading(true);
    createUser({
      user: {
        email,
        password,
        fullName: firstName + " " + lastName,
        phoneNumber: phoneNumber,
        countryCode: countryCode,
      },
      onSuccess() {
        setOpen(false);
      },
      onFinally() {
        setLoading(false);
      },
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    login();
  };
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    signup();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        resetForm();
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <div>
          <Button className="text-white">
            {t("logIn") + " / " + t("signUp")}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="">
            {mode === "login"
              ? t("logIn")
              : mode === "signup"
              ? t("signUp")
              : ""}
          </DialogTitle>
        </DialogHeader>

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div>
              <Input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => validateEmail(e.target.value)}
                required
              />
              {emailError && (
                <span className="block text-sm mt-2 text-chart-5">
                  {emailError}
                </span>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="w-full space-y-2">
              <Button
                type="submit"
                className="w-full text-white"
                disabled={loading}
              >
                {t("submit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full text-foreground"
                onClick={() => setMode("signup")}
              >
                {t("signUp")}
              </Button>
            </div>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div>
              <Input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => validateEmail(e.target.value)}
                required
              />
              {emailError && (
                <span className="block text-sm mt-2 text-chart-5">
                  {emailError}
                </span>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => validatePassword(e.target.value)}
                required
              />
              {passwordError && (
                <span className="block text-sm mt-2 text-chart-5">
                  {passwordError}
                </span>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder={t("confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) =>
                  validateConfirmPassword(password, e.currentTarget.value)
                }
                required
              />
              {confirmPasswordError && (
                <span className="block text-sm mt-2 text-chart-5">
                  {confirmPasswordError}
                </span>
              )}
            </div>
            <div className="w-full flex gap-2">
              <div>
                <Input
                  type="text"
                  placeholder={t("firstName")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={(e) => validateFirstName(e.target.value)}
                  required
                />
                {firstNameError && (
                  <span className="block text-sm mt-2 text-chart-5">
                    {firstNameError}
                  </span>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder={t("lastName")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={(e) => validateLastName(e.target.value)}
                  required
                />
                {lastNameError && (
                  <span className="block text-sm mt-2 text-chart-5">
                    {lastNameError}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Select
                  value={countryCode}
                  onValueChange={(value) => {
                    validateCountryCode(value);
                    setCountryCode(value);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((e) => (
                      <SelectItem key={e.code} value={e.code}>
                        {e.symbol + " " + e.phoneCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="tel"
                  placeholder={t("phoneNumber")}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onBlur={(e) =>
                    validatePhoneNumber(e.target.value, countryCode)
                  }
                  required
                  className="w-full"
                  maxLength={20}
                />
              </div>
              {countryCodeError ||
                (phoneNumberError && (
                  <span className="block text-sm mt-2 text-chart-5">
                    {countryCodeError || phoneNumberError}
                  </span>
                ))}
            </div>
            <div className="w-full space-y-2">
              <Button
                type="submit"
                className="w-full text-white"
                disabled={loading}
              >
                {t("submit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full text-foreground"
                onClick={() => setMode("login")}
              >
                {t("logIn")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
