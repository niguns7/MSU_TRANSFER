"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Select,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Stack,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoSchoolOutline,
  IoBookOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { sendTransferEmail } from "@/app/actions/sendTransferEmail";

interface TransferInitialFormData {
  fullName: string;
  phone: string;
  email: string;
  studyLevel: string;
  currentCollege: string;
  intendedMajor: string;
  transferTime: string;
}

export function TransferInitialForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<TransferInitialFormData>({
    initialValues: {
      fullName: "",
      phone: "",
      email: "",
      studyLevel: "",
      currentCollege: "",
      intendedMajor: "",
      transferTime: "",
    },
    validate: {
      fullName: (value) => (!value ? "Full name is required" : null),
      phone: (value) => (!value ? "Phone/WhatsApp is required" : null),
      email: (value) => {
        if (!value) return "Email is required";
        if (!/^\S+@\S+$/.test(value)) return "Invalid email format";
        return null;
      },
      studyLevel: (value) => (!value ? "Study level is required" : null),
      currentCollege: (value) =>
        !value ? "Current college is required" : null,
      intendedMajor: (value) => (!value ? "Intended major is required" : null),
      transferTime: (value) => (!value ? "Transfer time is required" : null),
    },
  });

  const handleSubmit = async (values: TransferInitialFormData) => {
    // Track form submit click
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "InitiateCheckout");
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/submissions/initial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "initial",
          ...values,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form");
      }

      // Send email to the student
      const emailResult = await sendTransferEmail({
        to: values.email,
        studentName: values.fullName,
        transferFormUrl: `${window.location.origin}/transfer-advising-full-form`,
      });

      if (!emailResult.success) {
        console.error("Failed to send email:", emailResult.message);
        // Don't fail the form submission if email fails
        notifications.show({
          title: "Form Submitted",
          message:
            "Your form was submitted, but we could not send the confirmation email.",
          color: "orange",
        });
      }

      // Track conversion
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead");
      }

      notifications.show({
        title: "Success!",
        message:
          "Your transfer advising initial form has been submitted. Check your email for next steps.",
        color: "teal",
      });

      // Redirect to success page
      router.push("/success/initial");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to submit form. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Paper
        shadow="lg"
        p={{ base: "md", sm: "xl" }}
        radius="lg"
        style={{
          background:
            "linear-gradient(135deg, rgba(123, 14, 47, 0.03) 0%, rgba(247, 181, 0, 0.05) 100%)",
          border: "1px solid rgba(123, 14, 47, 0.1)",
        }}
      >
        {/* Header Section */}
        <Stack gap="md" mb="xl">
          <div style={{ textAlign: "center" }}>
            <Title
              order={1}
              size="h2"
              fw={800}
              style={{
                background: "linear-gradient(135deg, #7B0E2F 0%, #F7B500 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
              }}
            >
              MIDWESTERN STATE UNIVERSITY
            </Title>
            <Title order={2} size="h4" fw={500}>
              TRANSFER ADVISING FORM
            </Title>
          </div>

          <Paper
            p="md"
            radius="md"
            style={{
              background:
                "linear-gradient(135deg, #7B0E2F 0%, #A13A1F 50%, #F7B500 100%)",
              textAlign: "center",
            }}
          >
            <Text c="white" fw={500} size="md" className="font-semibold">
              Please provide your details as in I-20/passport.
            </Text>
          </Paper>
        </Stack>

        {/* Form */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg" className="p-4">
            {/* Full Name */}
            <TextInput
              label="Full Name"
              placeholder="Enter Name"
              size="md"
              leftSection={<IoPersonOutline size={20} />}
              required
              styles={{
                input: {
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  "&:focus": {
                    borderColor: "#7B0E2F",
                  },
                },
                label: { fontWeight: 600, marginBottom: "8px" },
              }}
              {...form.getInputProps("fullName")}
            />

            {/* Phone/WhatsApp */}
            <TextInput
              label="Phone/Whatsapp"
              placeholder="Enter"
              size="md"
              leftSection={<IoCallOutline size={20} />}
              required
              styles={{
                input: {
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  "&:focus": {
                    borderColor: "#7B0E2F",
                  },
                },
                label: { fontWeight: 600, marginBottom: "8px" },
              }}
              {...form.getInputProps("phone")}
            />

            {/* Email */}
            <TextInput
              label="Email"
              placeholder="Enter email"
              size="md"
              type="email"
              leftSection={<IoMailOutline size={20} />}
              required
              styles={{
                input: {
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  "&:focus": {
                    borderColor: "#7B0E2F",
                  },
                },
                label: { fontWeight: 600, marginBottom: "8px" },
              }}
              {...form.getInputProps("email")}
            />

            {/* Study Level */}
            <Select
              label="Study Level"
              placeholder="Select Study Level"
              size="md"
              leftSection={<IoSchoolOutline size={20} />}
              required
              clearable
              data={[
                { value: "Freshman", label: "Freshman" },
                { value: "Undergraduate", label: "Undergraduate" },
                { value: "Graduate", label: "Graduate" },
                { value: "InternationalTransfer", label: "International Transfer" },
              ]}
              styles={{
                input: {
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  "&:focus": {
                    borderColor: "#7B0E2F",
                  },
                },
                label: { fontWeight: 600, marginBottom: "8px" },
              }}
              {...form.getInputProps("studyLevel")}
            />

            {/* Current College */}
            <TextInput
              label="Current College"
              placeholder="Enter your current college"
              size="md"
              leftSection={<IoSchoolOutline size={20} />}
              required
              styles={{
                input: {
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  "&:focus": {
                    borderColor: "#7B0E2F",
                  },
                },
                label: { fontWeight: 600, marginBottom: "8px" },
              }}
              {...form.getInputProps("currentCollege")}
            />

            {/* Intended Program/Major */}
            <TextInput
              label="Intended Program/ Major"
              placeholder="Enter your Major"
              size="md"
              leftSection={<IoBookOutline size={20} />}
              required
              styles={{
                input: {
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  "&:focus": {
                    borderColor: "#7B0E2F",
                  },
                },
                label: { fontWeight: 600, marginBottom: "8px" },
              }}
              {...form.getInputProps("intendedMajor")}
            />

            {/* When do you plan to transfer */}
            <Select
              label="When do you plan to transfer?"
              placeholder="Choose the intake time"
              size="md"
              leftSection={<IoCalendarOutline size={20} />}
              required
              clearable
              data={[
                { value: "2026-fall", label: "2026 Fall" },
                { value: "2027-spring", label: "2027 Spring" },
              ]}
              styles={{
                input: {
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  "&:focus": {
                    borderColor: "#7B0E2F",
                  },
                },
                label: { fontWeight: 600, marginBottom: "8px" },
              }}
              {...form.getInputProps("transferTime")}
            />

            {/* Submit Button */}
            <Group justify="space-between" mt="xl">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={loading}
                style={{
                  background:
                    "linear-gradient(135deg, #7B0E2F 0%, #A13A1F 50%, #F7B500 100%)",
                  borderRadius: "8px",
                  padding: "0 32px",
                }}
              >
                Submit
              </Button>
            </Group>
          </Stack>
        </form>

        {/* Footer Info */}
        <Paper
          p="lg"
          mt="xl"
          radius="md"
          style={{
            background:
              "linear-gradient(135deg, rgba(247, 181, 0, 0.1) 0%, rgba(123, 14, 47, 0.05) 100%)",
          }}
        >
          <Text size="sm" c="dimmed" ta="center" mb="sm">
            We evaluate your transfer eligibility, estimate the credit hours
            required for your chosen institution, and highlight opportunities
            such as transfer-merit scholarships and in-state tuition advantages
            that may apply to international students. Our guidance is available
            to both international and domestic applicants.
          </Text>
        </Paper>
      </Paper>
    </Container>
  );
}
