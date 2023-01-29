import { useState } from 'react';
import { Demo001 } from './demos/demo-001';
import { Demo002 } from './demos/demo-002';
import { Demo003 } from './demos/demo-003';
import { Demo004 } from './demos/demo-004';
import { Demo005 } from './demos/demo-005';
import { Demo006 } from './demos/demo-006';
import { WindowHistoryAdapter } from 'use-query-params/adapters/window';
import { NumberParam, QueryParamProvider, useQueryParam } from 'use-query-params';


/**
 * @example
 * wrapNumber(10, 25, 11); // 11
 * wrapNumber(10, 25, 10); // 10
 * wrapNumber(10, 25, 9); // 25
 * wrapNumber(10, 25, 24); // 24
 * wrapNumber(10, 25, 25); // 25
 * wrapNumber(10, 25, 26); // 10
 */
const wrapNumber = (min: number, max: number, num: number) => {
  return ((((num - min) % (max - min)) + (max - min)) % (max - min)) + min;
};

const Demos = [
  Demo001,
  Demo002,
  Demo003,
  Demo004,
  Demo005,
  Demo006,
];

export const App = () => (
  <QueryParamProvider adapter={WindowHistoryAdapter}>
    <Nested />
  </QueryParamProvider>
);


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
    const newIndex = wrapNumber(0, Demos.length - 1, demoIndex - 1);
    setDemoIndexParam(newIndex);
    window.location.reload();
  };
  const goNextDemo = () => {
    const newIndex = wrapNumber(0, Demos.length - 1, demoIndex + 1);
    setDemoIndexParam(newIndex);
    window.location.reload();
  };

  return {
    demoIndex,
    goNextDemo,
    goPrevDemo,
  };

};

const Nested = () => {
  const { demoIndex, goPrevDemo, goNextDemo } = useDemoIndex();
  const DemoComponent = Demos[demoIndex];

  return (
    <div className='page'>
      <DemoComponent />
      <div className='demo-switcher'>
        <button type="button" onClick={goPrevDemo}>{"<"}</button>
        <button type="button" onClick={goNextDemo}>{">"}</button>
      </div >
    </div >
  );
};