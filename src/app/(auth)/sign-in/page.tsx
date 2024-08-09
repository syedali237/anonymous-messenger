'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function page() {
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setisCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);

  // for reducing server load
  const debouncedUsername = useDebounceValue(username, 300);

  const { toast } = useToast()
  const router = useRouter();

  // const form = 


  return (<div>page</div>);
}