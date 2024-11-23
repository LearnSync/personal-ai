import unittest
from typing import List, Dict, Optional
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, AIMessagePromptTemplate, PromptTemplate

from app.enums.topic import Topic
from app.utils.helpers import build_prompt_from_messages


class TestBuildPromptFromMessages(unittest.TestCase):
    """
    Test suite for the `build_prompt_from_messages` function.
    """

    def setUp(self):
        """
        Set up common test data for all tests.
        """
        self.messages: List[Dict[str, str]] = [
            {"role": "user", "content": "What is recursion?"},
            {"role": "assistant", "content": "Recursion is a function calling itself."},
            {"role": "user", "content": "Can you provide an example?"},
        ]

    def _create_expected_template(self, messages, topic: Optional[Topic]):
        """
        Create message templates with an optional topic.

        Args:
            messages (List[Dict[str, str]]): List of dictionaries with 'role' and 'content'.
            topic (Optional[Topic]): An optional topic to add a system message.

        Returns:
            List: A list of message templates formatted as ChatPromptTemplate objects.
        """
        role_to_template = {
            "system": SystemMessagePromptTemplate,
            "user": HumanMessagePromptTemplate,
            "assistant": AIMessagePromptTemplate,
        }

        templates = []

        # Add the topic-related system message if provided
        if topic:
            templates.append(
                SystemMessagePromptTemplate(
                    prompt=PromptTemplate(
                        input_variables=[],
                        input_types={},
                        partial_variables={},
                        template=f"This is a {topic} related conversation."
                    ),
                    additional_kwargs={}
                )
            )

        # Add other messages
        templates.extend(
            role_to_template[msg["role"]](
                prompt=PromptTemplate(
                    input_variables=[],
                    input_types={},
                    partial_variables={},
                    template=msg["content"]
                ),
                additional_kwargs={}
            )
            for msg in messages if msg["role"] in role_to_template
        )
        return templates

    def test_valid_input(self):
        """
        Test the function with valid input messages.
        """
        topic = None
        prompt_template = build_prompt_from_messages(self.messages, topic)
        self.assertIsInstance(prompt_template, ChatPromptTemplate)

        # Generate the expected output structure
        expected_structure = self._create_expected_template(self.messages, topic)

        # Assert that the generated structure matches the expected one
        self.assertEqual(prompt_template.messages, expected_structure)

    def test_empty_messages(self):
        """
        Test the function with an empty list of messages.
        """
        topic = None
        empty_messages: List[Dict[str, str]] = []
        prompt_template = build_prompt_from_messages(empty_messages, topic)
        self.assertIsInstance(prompt_template, ChatPromptTemplate)
        self.assertEqual(prompt_template.messages, [])

    def test_additional_topic_handling(self):
        """
        Test the function with an optional topic provided.
        """
        topic = Topic.CODE
        prompt_template = build_prompt_from_messages(self.messages, topic)
        self.assertIsInstance(prompt_template, ChatPromptTemplate)

        # Generate the expected output structure
        expected_structure = self._create_expected_template(self.messages, topic)

        # Assert that the generated structure matches the expected one
        self.assertEqual(prompt_template.messages, expected_structure)

    def test_invalid_message_structure(self):
        """
        Test the function with invalid message structures (missing keys).
        """
        invalid_messages: List[Dict[str, str]] = [
            {"role": "user"},  # Missing 'content'
            {"content": "This is invalid."},  # Missing 'role'
        ]
        with self.assertRaises(KeyError):
            build_prompt_from_messages(invalid_messages, topic=None)

    def test_unsupported_role(self):
        """
        Test the function with an unsupported role.
        """
        unsupported_messages = [
            {"role": "random", "content": "This role is not supported."},
        ]
        with self.assertRaises(KeyError):
            build_prompt_from_messages(unsupported_messages, topic=None)


if __name__ == "__main__":
    unittest.main()
