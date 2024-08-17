# Llama 3.1 Function Calling Proxy

## Overview

The Llama 3.1 Function Calling Proxy is a Node.js-based middleware designed to facilitate the integration of function calling capabilities with Llama 3.1 models. This proxy allows users to interact with Llama 3.1 in a more dynamic way by enabling function calls based on prompts and returning structured results. It is designed for developers who want to leverage advanced language model capabilities while integrating them into their applications.

## Features

- **Function Call Extraction:** Automatically extract and process function calls from model responses.
- **Dynamic Prompt Modification:** Modify prompts dynamically before sending them to the Llama 3.1 model to enable seamless function call interactions.
- **Error Handling:** Robust error handling for function execution and validation errors, ensuring stability in production environments.
- **Logging:** Detailed logging of requests, responses, and function execution.
- **Cross-Platform Compatibility:** Compatible with Windows, macOS, and Linux environments.

## Getting Started

### Prerequisites

- Node.js (version 18.x or later)
- A Llama 3.1 model (preferably configured with function calling capabilities)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/hotdropper/llama-3.1-function-calling-proxy.git
   cd llama-3.1-function-calling-proxy

2. **Install Dependencies**

   ```bash
   npm install

3. Configure Environment Variables

    Create a .env file in the root directory with the necessary configuration:

    ```env
    OPENAI_API_BASE_URL=http://localhost:8080
    OPENAI_API_KEY=boguskey
    PORT=3000
    HOST=127.0.0.1
    COMPLETION_ENDPOINT=/v1/completions
   
4. Start the Proxy

    ```bash
    npm start
    ```   
    
    The proxy server will start on the specified port (default: 3000).

## Usage

### Sending Requests

To interact with the Llama 3.1 model through the proxy, send a POST request to the `/v1/completions` endpoint with the following JSON structure:

```json
{
  "model": "llama-31b",
  "prompt": "Your prompt here...",
  "max_tokens": 50,
  "temperature": 0.7
}
```

### Example Response

The proxy will process the prompt, extract any function calls, execute them, and return a structured response. An example response might look like:

```json
{
  "content": "The weather in Mexico City is sunny with a temperature of 25°C.",
  "model": "Meta-Llama-3.1-8B",
  "tokens_predicted": 16,
  "tokens_evaluated": 422
}
```

### Error Handling

Errors during function execution or validation are logged and returned in the response for easy debugging. For example:

```json
{
  "error": "Validation failed for function getWeather",
  "validationErrors": ["Unknown location parameter"]
}
```

## Customization

### Adding New Functions

You can add new functions to be called by the model by defining them in functionDefinitions.js and implementing their logic in functions.js. Ensure that each function is well-documented and that its parameters are validated against a JSON schema.

### Logging

Logging is handled by the logger utility. You can configure the logging level or add custom loggers as needed.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

Special thanks to the developers and community members who contributed to the Llama 3.1 model and the broader open-source AI ecosystem.

## Contact

For any questions or support, please open an issue on the [GitHub repository](https://github.com/hotdropper/llama-3.1-function-calling-proxy).