import { useState } from 'react';

import { IconTextButton } from '../Buttons';
import GraphIcon from '../../assets/icons/graph.svg?react';
import ChartIcon from '../../assets/icons/chart.svg?react';
import SettingIcon from '../../assets/icons/setting.svg?react';

export default function SideNav() {
  const [activeTab, setActiveTab] = useState('인터렉션');
  //TODO: 버튼 클릭 시 네비게이트
  return (
    <section className="w-32 min-w-32 h-dvh flex flex-col gap-12 py-4 border-r-2">
      <IconTextButton
        Icon={GraphIcon}
        text="인터렉션"
        isActive={activeTab === '인터렉션'}
        onClick={() => setActiveTab('인터렉션')}
      />
      <IconTextButton
        Icon={ChartIcon}
        text="통계"
        isActive={activeTab === '통계'}
        onClick={() => setActiveTab('통계')}
      />
      <IconTextButton
        Icon={SettingIcon}
        text="설정"
        isActive={activeTab === '설정'}
        onClick={() => setActiveTab('설정')}
      />
    </section>
  );
}
