// src/sections/authSections/SignupFormSection.tsx
"use client";

import Link from "next/link";
import { Mail, User } from "lucide-react";
import AuthInput from "@/src/components/authComponents/AuthInput";
import PasswordInput from "@/src/components/authComponents/PasswordInput";
import GoogleButton from "@/src/components/authComponents/GoogleButton";
import PrimaryButton from "@/src/components/authComponents/PrimaryButton";
import StepBadge from "@/src/components/authComponents/StepBadge";
import { signupContent } from "@/src/data/authData/signupData";
import { useSignupForm } from "@/src/hooks/useSignupForm";

const SignupFormSection = () => {
  const {
    values,
    errors,
    isSubmitting,
    serverError,
    handleChange,
    handleSubmit,
    handleGoogleSignup,
  } = useSignupForm();

  return (
    <section className="flex w-full flex-col justify-center px-6 py-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <StepBadge label={signupContent.stepLabel} />
          <h2 className="font-manrope text-[32px] font-bold leading-tight text-[#141D1B]">
            {signupContent.heading}
          </h2>
          <p className="text-[15px] text-[#5C6B69]">
            {signupContent.subheading}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            label={signupContent.fields.fullName.label}
            placeholder={signupContent.fields.fullName.placeholder}
            icon={User}
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            error={errors.fullName}
            autoComplete="name"
          />

          <AuthInput
            label={signupContent.fields.email.label}
            placeholder={signupContent.fields.email.placeholder}
            icon={Mail}
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <PasswordInput
            label={signupContent.fields.password.label}
            placeholder={signupContent.fields.password.placeholder}
            name="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />

          {serverError && (
            <p className="text-sm text-red-500" role="alert">
              {serverError}
            </p>
          )}

          <PrimaryButton
            label={signupContent.submitLabel}
            isLoading={isSubmitting}
            className="mt-2"
          />

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <span className="h-px flex-1 bg-[#C1C8C8]" />
            <span className="text-xs font-medium tracking-widest text-[#717879]">
              {signupContent.dividerLabel}
            </span>
            <span className="h-px flex-1 bg-[#C1C8C8]" />
          </div>

          <GoogleButton
            label={signupContent.googleLabel}
            onClick={handleGoogleSignup}
          />
        </form>

        {/* Footer link */}
        <p className="text-center text-[15px] text-[#5C6B69]">
          {signupContent.footerText}{" "}
          <Link
            href={signupContent.footerLinkHref}
            className="font-medium text-[#325A5E] hover:underline"
          >
            {signupContent.footerLinkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignupFormSection;