import { useState } from 'react';
import { WindowHistoryAdapter } from 'use-query-params/adapters/window';
import { NumberParam, QueryParamProvider, useQueryParam } from 'use-query-params';
import { Demo001 } from './demos/demo-001';
import { Demo002 } from './demos/demo-002';
import { Demo003 } from './demos/demo-003';
import { Demo004 } from './demos/demo-004';
import { Demo005 } from './demos/demo-005';
import { Demo006 } from './demos/demo-006';
import { Demo007 } from './demos/demo-007';
import { Demo008 } from './demos/demo-008';
import { Demo009 } from './demos/demo-009';
import { Demo010 } from './demos/demo-010';
import { Demo011 } from './demos/demo-011';
import { Demo012 } from './demos/demo-012';


/**
 * @example
 * wrapNumber(10, 25, 11); // 11
 * wrapNumber(10, 25, 10); // 10
 * wrapNumber(10, 25, 9); // 25
 */
const wrapNumber = (min: number, max: number, num: number) => {
  return ((((num - min) % (max - min)) + (max - min)) % (max - min)) + min;
};

export const App = () => (
  <QueryParamProvider adapter={WindowHistoryAdapter}>
    <Nested />
  </QueryParamProvider>
);

const Demos = [
  Demo001,
  Demo002,
  Demo003,
  Demo004,
  Demo005,
  Demo006,
  Demo007,
  Demo008,
  Demo009,
  Demo010,
  Demo011,
  Demo012,
];

const useDemoIndex = () => {
  // Store demo index in URL query params
  // NOTE:
  // I choose to do this because a page refresh ensure that the previous 
  // THREE js scene is completly destroyed, and memory is realesed.
  //
  // Why not "dispose()" ?
  // I tried, but FPS will drop anyway when changing demo
  const [demoIndexParam, setDemoIndexParam] = useQueryParam('demo-index', NumberParam);
  const demoIndex = demoIndexParam ?? 0;
  const goPrevDemo = () => {
    const newIndex = wrapNumber(0, Demos.length, demoIndex - 1);
    setDemoIndexParam(newIndex);
    window.location.reload();
  };
  const goNextDemo = () => {
    const newIndex = wrapNumber(0, Demos.length, demoIndex + 1);
    setDemoIndexParam(newIndex);
    window.location.reload();
  };

  return {
    demoIndex,
    goNextDemo,
    goPrevDemo,
  };

};

const DemoSwitcher = ({ demoIndex, goPrevDemo, goNextDemo }: ReturnType<typeof useDemoIndex>) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleIsOpen = () => setIsOpen(prev => !prev);

  return (
    <div className={`demo-switcher ${isOpen ? 'is-open' : ''}`}>
      <div className="toggler" onClick={toggleIsOpen}>👈</div>
      <span className='demo-title'>Demo - {demoIndex + 1}</span>
      <div className='controls'>
        <button type="button" onClick={goPrevDemo}>{"<"}</button>
        <button type="button" onClick={goNextDemo}>{">"}</button>
      </div>
    </div>
  );
};

const Nested = () => {
  const { demoIndex, goPrevDemo, goNextDemo } = useDemoIndex();
  const DemoComponent = Demos[demoIndex];

  return (
    <div className='page'>
      <DemoComponent />
      <DemoSwitcher
        demoIndex={demoIndex}
        goPrevDemo={goPrevDemo}
        goNextDemo={goNextDemo}
      />
    </div >
  );
};