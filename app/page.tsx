"use client"
import React, { useState } from "react"
import { Formik, Field } from "formik"
import * as Yup from "yup"
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Spinner,
  Heading,
  Text,
  Select,
  useColorModeValue,
} from "@chakra-ui/react"

import { SelectControl } from "formik-chakra-ui"

export default function Home() {
  const [gratitude, setGratitude] = useState("")
  const [gratitudeLoading, setGratitudeLoading] = useState(false)
  const [gratitudeLoadingError, setGratitudeLoadingError] = useState(false)

  const initialValues = {
    name: "",
    category: "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    category: Yup.string().required(),
  })

  async function handleSubmit(name: string, category: string) {
    if (name && category) {
      try {
        setGratitude("")
        setGratitudeLoadingError(false)
        setGratitudeLoading(true)

        const response = await fetch(
          "/api/generate?prompt=" +
            encodeURIComponent(name) +
            "&category=" +
            encodeURIComponent(category)
        )
        const body = await response.json()
        setGratitude(body.quote)
      } catch (error) {
        console.error(error)
        setGratitudeLoadingError(true)
      } finally {
        setGratitudeLoading(false)
      }
    }
  }

  return (
    <main>
      <Flex
        bg={useColorModeValue("gray.50", "gray.700")}
        color={useColorModeValue("gray.700", "gray.200")}
        align="center"
        justify="center"
        h="83vh"
      >
        <VStack spacing={4} align="center" textAlign={"center"}>
          <Box p={{ base: 2, md: 6 }}>
            <Heading
              fontWeight={700}
              fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Generate a thought of <br />
              <Text as={"span"} color={"purple.400"}>
                gratitude
              </Text>
              {" and "}
              <Text as={"span"} color={"orange.400"}>
                appreciation
              </Text>
            </Heading>
          </Box>

          <Box p={6} rounded="md" w={80} bg="white" color="black">
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => {
                // alert(JSON.stringify(values, null, 2))
                handleSubmit(values["name"], values["category"])
              }}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, values, errors }) => (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="flex-start">
                    <FormControl>
                      <FormLabel htmlFor="category">
                        Select a person, place or thing
                      </FormLabel>
                      <SelectControl
                        name="category"
                        selectProps={{ placeholder: "Select option" }}
                      >
                        <option value="person">Person</option>
                        <option value="place">Place</option>
                        <option value="thing">Thing</option>
                      </SelectControl>
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="name">
                        What is it/their name?
                      </FormLabel>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="name"
                        variant="filled"
                        bg="gray.200"
                      />
                    </FormControl>
                    <Button type="submit" colorScheme="purple" width="full">
                      Generate Thought
                    </Button>
                  </VStack>
                </form>
              )}
            </Formik>
            {gratitudeLoading && <Spinner animation="border" />}
            {gratitudeLoadingError && "Something went wrong. Please try again."}
          </Box>
          {gratitude && (
            <Box bg="white" p={6} rounded="md" w={80}>
              <Text fontWeight={700} color={"purple.400"}>
                {gratitude}
              </Text>
            </Box>
          )}
        </VStack>
      </Flex>
    </main>
  )
}
