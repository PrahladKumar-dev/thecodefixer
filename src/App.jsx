import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from '@google/genai';
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

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_API_KEY,
  });

  // FIX CODE

  async function fixCode() {

    setLoading(true);

    try {

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',

        contents: `
Fix the following ${selectedOption.value} code.
Return ONLY the corrected code.

${code}
`,
      });

      setCode(result.text);

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

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',

        contents: `
Review this ${selectedOption.value} code.

1. Quality Rating
2. Suggestions
3. Explain code
4. Bugs
5. Improvements

Code:
${code}
`,
      });

      setResponse(result.text);

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

       " https://thecodefixer.onrender.com/run",

        {
          source_code: code,
        }

      );

      console.log(response.data);

      setOutput(

        response.data.output ||

        'No Output'

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

            {/* SELECT */}

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

            {/* FIX BUTTON */}

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

            {/* REVIEW BUTTON */}

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

            {/* RUN BUTTON */}

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

          {/* LOADER */}

          {loading && (
            <div className="flex justify-center items-center h-full">
              <CircleLoader
                color="#9333ea"
                size={200}
              />
            </div>
          )}

          {/* REVIEW */}

          <Markdown>
            {response}
          </Markdown>

          {/* OUTPUT */}

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