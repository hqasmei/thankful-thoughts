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
  useColorModeValue,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react"

import { SelectControl } from "formik-chakra-ui"

export default function Home() {
  const [gratitude, setGratitude] = useState("")
  const [gratitudeLoading, setGratitudeLoading] = useState(false)
  const [gratitudeLoadingError, setGratitudeLoadingError] = useState(false)

  const initialValues = {
    category: "person",
    personName: "",
    personPronoun: "she/her",
    petType: "",
    petName: "",
    placeName: "",
    thingName: "",
  }

  // const validationSchema = Yup.object({
  //   category: Yup.string().required(),
  //   personName: Yup.string().required(),
  //   personPronoun: Yup.string().required(),
  //   petType: Yup.string().required(),
  //   petName: Yup.string().required(),
  //   placeName: Yup.string().required(),
  //   thingName: Yup.string().required(),
  // })

  async function repeat(prompt: string) {
    setGratitude("")
    setGratitudeLoadingError(false)
    setGratitudeLoading(true)

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setGratitude((prev) => prev + chunkValue)
    }

    setGratitudeLoading(false)
  }

  async function handleSubmit(
    category: string,
    personName: string,
    personPronoun: string,
    petType: string,
    petName: string,
    placeName: string,
    thingName: string
  ) {
    const personPrompt = `Generate a sentence of gratitude for ${personName}. Their pronouns are ${personPronoun}. 
                          In a similar format to, I am grateful for ${personName} because...`

    const petPrompt = `Generate a sentence of gratitude for ${petName} who is a pet ${petType}.
                       In a similar format to, I am grateful for ${petName} because...`

    const placePrompt = `Create a sentence of gratitude based on the following category and topic name. In the format, I am grateful for topic because...\n
                        Category: a place\n Topic: ${placeName}\n`

    const thingPrompt = `Create a sentence of gratitude based on the following thing and it's name. In the format, I am grateful for topic because...\n
                        Category: a thing\n Topic: ${thingName}\n`

    if (category == "person") {
      try {
        repeat(personPrompt)
      } catch (error) {
        console.error(error)
        setGratitudeLoadingError(true)
      } finally {
        setGratitudeLoading(false)
      }
    } else if (category == "pet") {
      try {
        repeat(petPrompt)
      } catch (error) {
        console.error(error)
        setGratitudeLoadingError(true)
      } finally {
        setGratitudeLoading(false)
      }
    } else if (category == "place") {
      try {
        repeat(placePrompt)
      } catch (error) {
        console.error(error)
        setGratitudeLoadingError(true)
      } finally {
        setGratitudeLoading(false)
      }
    } else if (category == "thing") {
      try {
        repeat(thingPrompt)
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
              onSubmit={(values, { resetForm }) => {
                handleSubmit(
                  values["category"],
                  values["personName"],
                  values["personPronoun"],
                  values["petType"],
                  values["petName"],
                  values["placeName"],
                  values["thingName"]
                )

                resetForm()
              }}
              // validationSchema={validationSchema}
            >
              {({ handleSubmit, values, errors }) => (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="flex-start">
                    <FormControl isRequired>
                      <FormLabel htmlFor="category">Select an option</FormLabel>
                      <SelectControl name="category">
                        <option value="person">Person</option>
                        <option value="pet">Pet</option>
                        <option value="place">Place</option>
                        <option value="thing">Thing</option>
                      </SelectControl>
                      <FormErrorMessage>{errors.category}</FormErrorMessage>
                    </FormControl>
                    {values.category === "person" && (
                      <>
                        <FormControl isRequired>
                          <FormLabel htmlFor="personName">
                            What is their name?
                          </FormLabel>
                          <Field
                            as={Input}
                            id="personName"
                            name="personName"
                            type="name"
                            variant="filled"
                            bg="gray.200"
                          />
                          <FormErrorMessage>
                            {errors.personName}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel htmlFor="personPronoun">
                            Pronouns
                          </FormLabel>
                          <SelectControl name="personPronoun">
                            <option value="she/her">she/her</option>
                            <option value="he/his">he/his</option>
                            <option value="they/them">they/them</option>
                          </SelectControl>
                          <FormErrorMessage>
                            {errors.personPronoun}
                          </FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                    {values.category === "pet" && (
                      <>
                        <FormControl isRequired>
                          <FormLabel htmlFor="petType">
                            What type of pet do you have?
                          </FormLabel>
                          <Field
                            as={Input}
                            id="petType"
                            name="petType"
                            type="name"
                            variant="filled"
                            bg="gray.200"
                          />
                          <FormErrorMessage>{errors.petType}</FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel htmlFor="petName">
                            What's your pet's name?
                          </FormLabel>
                          <Field
                            as={Input}
                            id="petName"
                            name="petName"
                            type="name"
                            variant="filled"
                            bg="gray.200"
                          />
                          <FormErrorMessage>{errors.petName}</FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                    {values.category === "place" && (
                      <>
                        <FormControl isRequired>
                          <FormLabel htmlFor="placeName">
                            What's the name of the place?
                          </FormLabel>
                          <Field
                            as={Input}
                            id="placeName"
                            name="placeName"
                            type="name"
                            variant="filled"
                            bg="gray.200"
                          />
                          <FormErrorMessage>
                            {errors.placeName}
                          </FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                    {values.category === "thing" && (
                      <>
                        <FormControl isRequired>
                          <FormLabel htmlFor="thingName">
                            What's the thing?
                          </FormLabel>
                          <Field
                            as={Input}
                            id="thingName"
                            name="thingName"
                            type="name"
                            variant="filled"
                            bg="gray.200"
                          />
                          <FormErrorMessage>
                            {errors.thingName}
                          </FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                    <Button type="submit" colorScheme="purple" width="full">
                      Generate Thought
                    </Button>
                  </VStack>
                </form>
              )}
            </Formik>
            {gratitudeLoading && (
              <Box py={4}>
                <Spinner />
              </Box>
            )}
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
