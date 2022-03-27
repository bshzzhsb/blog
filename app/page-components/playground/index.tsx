import { useEffect, useMemo, useRef, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import { CODES, TEXT } from '~/constants';
import debounce from '~/utils/debounce';
import Tabs, { TabPane } from '~/components/tabs';
import { Arrow, Reset, Split } from '~/components/icon';
import { IconButton } from '~/components/button';
import { constructCode } from '~/page-components/playground/construct-code';
import Editor from '~/page-components/playground/editor';
import Result from '~/page-components/playground/result';
import Console from '~/page-components/playground/console';
import type { Language } from '~/page-components/playground/utils';
import type { ErrorType } from '~/page-components/playground/error';

interface PlaygroundProps {
  id: string;
}

const Playground: React.FC<PlaygroundProps> = ({ id }) => {
  const [codes, setCodes] = useState(CODES);
  const [debouncedCode, setDebouncedCode] = useState(cloneDeep(CODES));
  const [error, setError] = useState<ErrorType | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(true);
  const dragConstrainsRef = useRef<HTMLDivElement>(null);

  const debouncedSetCodes = useMemo(() => debounce(setDebouncedCode, 300), []);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setLogs([]);
    setError(null);
    debouncedSetCodes(cloneDeep(codes));
  }, [codes, debouncedSetCodes]);

  const onTextareaChange = (key: Language) => {
    return (code: string) => {
      setCodes((pre) => {
        const res = [...pre];
        const i = res.findIndex((c) => c.lang === key);
        if (i !== -1) res[i] = { lang: res[i].lang, code: code };
        return [...res];
      });
    };
  };

  const handleChangeShowResult = () => {
    setShowResult((pre) => !pre);
    setError(null);
    setLogs([]);
  };

  return (
    <>
      <header className="grid grid-cols-3 h-12 items-center border-b">
        <div className="ml-4">
          <IconButton onClick={() => history.back()}>
            <Arrow className="w-5 h-5 rotate-180" />
          </IconButton>
        </div>
        <div className="text-center text-xl font-semibold tracking-wide">{TEXT.playground}</div>
        <div className="flex justify-end gap-4 mr-4">
          <IconButton onClick={() => setCodes(CODES)}>
            <Reset className="w-5 h-5" />
          </IconButton>
          <IconButton onClick={handleChangeShowResult}>
            <Split className="w-5 h-5" split={showResult} />
          </IconButton>
        </div>
      </header>
      <div
        ref={dragConstrainsRef}
        className={
          'grid md:grid-rows-1 w-screen h-[calc(100vh-3rem)] dark:bg-white dark:text-black ' +
          (showResult ? 'grid-rows-2 md:grid-cols-2' : 'grid-rows-1 md:grid-cols-1')
        }
      >
        <Tabs>
          {codes.map(({ lang, code }) => (
            <TabPane key={lang} tabKey={lang} name={lang.toUpperCase()}>
              <Editor defaultCode={code} language={lang} onChange={onTextareaChange(lang)} />
            </TabPane>
          ))}
        </Tabs>
        {showResult && (
          <Tabs className="border-t-2 md:border-t-0 md:border-l-2">
            <TabPane tabKey="result" name="RESULT">
              <Result
                id={id}
                loading={loading}
                code={constructCode(debouncedCode, id)}
                error={error}
                setError={setError}
              />
            </TabPane>
            <TabPane tabKey="console" name="CONSOLE">
              <Console id={id} logs={logs} setLogs={setLogs} />
            </TabPane>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default Playground;
