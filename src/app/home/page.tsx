"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmailEditor from "@/components/email-editor";
import { createClient } from "@/lib/client";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.replace("/auth/login");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleSend = async () => {
    setError(null);
    setIsSending(true);

    try {
      const emailList = emails.split(",").map((email) => email.trim());
      if (!emailList.length || !subject || !content) {
        throw new Error("Please fill in all fields");
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: emailList,
          subject,
          content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send emails");
      }

      // Clear form
      setEmails("");
      setSubject("");
      setContent("");
      setIsPreview(false);
      alert("Emails sent successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="emails">Email Addresses (comma-separated)</Label>
          <Input
            id="emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
            disabled={isPreview}
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            disabled={isPreview}
          />
        </div>

        <div>
          <Label>Email Content</Label>
          {isPreview ? (
            <div
              className="border rounded-md p-4 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <EmailEditor onChange={setContent} content={content} />
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !emails || !subject || !content}
          >
            {isSending ? "Sending..." : "Send Emails"}
          </Button>
        </div>
      </div>
    </div>
  );
}
