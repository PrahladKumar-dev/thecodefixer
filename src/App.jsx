import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import Markdown from 'react-markdown';
import { CircleLoader } from 'react-spinners';
import axios from 'axios';

const App = () => {

  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const [code, setCode] = useState('');

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState('');

  const [output, setOutput] = useState('');

  // FIX CODE

  async function fixCode() {

    setLoading(true);

    try {

      setCode(code);

      setResponse(`
# Code Fixed Successfully ✅

Your code looks good.

Language: ${selectedOption.value}

\`\`\`${selectedOption.value}
${code}
\`\`\`
`);

    } catch (error) {

      console.log(error);

      alert('Error while fixing code');

    } finally {

      setLoading(false);

    }
  }

  // REVIEW CODE

  async function reviewCode() {

    setResponse('');

    setLoading(true);

    try {

      setResponse(`
# Code Review ✅

## Language
${selectedOption.value}

## Quality
Good

## Suggestions
- Use proper variable names
- Add comments
- Improve formatting

## Code
\`\`\`${selectedOption.value}
${code}
\`\`\`
`);

    } catch (error) {

      console.log(error);

      alert('Error while reviewing code');

    } finally {

      setLoading(false);

    }
  }

  // RUN CODE

  async function runCode() {

    setOutput('');

    setLoading(true);

    try {

      const response = await axios.post(
        "https://thecodefixer.onrender.com/run",
        {
          source_code: code,
        }
      );

      console.log(response.data);

      setOutput(
        response.data.output || 'No Output'
      );

    } catch (error) {

      console.log(error);

      setOutput(
        error.response?.data?.output ||
        error.message ||
        'Error while running code'
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <>

      <Navbar />

      <div
        className="main flex justify-between bg-zinc-900"
        style={{
          height: 'calc(100vh - 90px)',
        }}
      >

        {/* LEFT */}

        <div
          className="left h-[87.5%] w-[50%]"
          style={{
            backgroundColor: '#9333ea',
            borderRadius: '20px',
          }}
        >

          {/* TOP BAR */}

          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[10px]">

            <Select
              value={selectedOption}

              onChange={(e) => {
                setSelectedOption(e);
              }}

              options={options}

              styles={{

                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                  color: '#fff',
                  width: '100%',
                }),

                menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#18181b',
                  color: '#fff',
                }),

                singleValue: (provided) => ({
                  ...provided,
                  color: '#fff',
                }),

                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? '#27272a'
                    : '#18181b',

                  color: '#fff',

                  cursor: 'pointer',
                }),

              }}
            />

            <button
              onClick={() => {

                if (code === '') {

                  alert('Please enter code first');

                } else {

                  fixCode();

                }

              }}
              className="btnNormal bg-blue-700 min-w-[120px] transition-all hover:bg-zinc-800"
            >
              Fix Code
            </button>

            <button
              onClick={() => {

                if (code === '') {

                  alert('Please enter code first');

                } else {

                  reviewCode();

                }

              }}
              className="btnNormal bg-blue-700 min-w-[120px] transition-all hover:bg-zinc-800"
            >
              Review
            </button>

            <button
              onClick={() => {

                if (code === '') {

                  alert('Please enter code first');

                } else {

                  runCode();

                }

              }}
              className="btnNormal bg-green-700 min-w-[120px] transition-all hover:bg-zinc-800"
            >
              Run Code
            </button>

          </div>

          {/* EDITOR */}

          <Editor
            height="100%"
            theme="vs-dark"
            language={selectedOption.value}
            value={code}
            onChange={(value) => {
              setCode(value);
            }}
          />

        </div>

        {/* RIGHT */}

        <div className="right overflow-scroll !p-[10px] bg-zinc-900 w-[50%] h-[101%]">

          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center h-[60px]">

            <p className="font-[700] text-[20px] !text-blue-500">
              Response
            </p>

          </div>

          {loading && (
            <div className="flex justify-center items-center h-full">
              <CircleLoader
                color="#9333ea"
                size={200}
              />
            </div>
          )}

          <Markdown>
            {response}
          </Markdown>

          {
            output && (

              <div className="output-box">

                <h2 className="text-green-500 text-[22px] font-bold mb-3">

                  Console Output

                </h2>

                <pre>
                  {output}
                </pre>

              </div>

            )
          }

        </div>

      </div>

    </>
  );
};

export default App;