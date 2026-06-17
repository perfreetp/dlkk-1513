import { useEffect } from 'react';
import { Row, Col, Card, Statistic, Divider, Tag, notification } from 'antd';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  BellRing,
  ListPlus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useQueueStore, type QueueItem } from '@/store/queueStore';
import { queueDataList } from '@/data/mock/queueData';
import QueueList from './QueueList';
import QuickCreate from './QuickCreate';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import PageLayout from '@/components/layout/PageLayout';

interface CallReceiveProps {
  className?: string;
}

export default function CallReceive({ className }: CallReceiveProps) {
  const {
    queueList,
    setQueueList,
    currentCalling,
    currentServing,
    autoPlayVoice,
    setAutoPlayVoice,
    setCurrentWindow,
    getWaitingCount,
  } = useQueueStore();

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (queueList.length === 0) {
      const mappedList: QueueItem[] = queueDataList.map((q, idx) => ({
        id: q.id,
        number: q.queueNo,
        caseId: `case-${idx}`,
        applicantName: q.applicantName,
        phone: '',
        serviceType: q.sceneName,
        priority: false,
        status:
          q.status === 'handling'
            ? 'serving'
            : q.status === 'passed'
              ? 'missed'
              : q.status,
        windowNumber: q.windowNo,
        arrivalTime: q.arriveTime
          ? dayjs(q.arriveTime).toISOString()
          : new Date().toISOString(),
        calledTime: q.calledTime
          ? dayjs(q.calledTime).toISOString()
          : undefined,
        callCount: q.status === 'calling' ? 1 : 0,
      }));
      setQueueList(mappedList);
    }
    setCurrentWindow('1号窗口');
  }, [queueList.length, setQueueList, setCurrentWindow]);

  const callingCount = queueList.filter((q) => q.status === 'calling').length;
  const servingCount = queueList.filter((q) => q.status === 'serving').length;
  const completedCount = queueList.filter((q) => q.status === 'completed').length;
  const missedCount = queueList.filter((q) => q.status === 'missed').length;

  const handleCallNextSuccess = (item: QueueItem | null) => {
    if (item) {
      api.success({
        message: '叫号成功',
        description: (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Tag color="blue" className="!m-0">
                {item.number}
              </Tag>
              <span className="font-medium">{item.applicantName}</span>
            </div>
            <p className="text-sm text-slate-500 !m-0">
              请前往 {item.windowNumber || '指定窗口'} 办理
            </p>
          </div>
        ),
        icon: <BellRing className="h-6 w-6 text-blue-500" />,
        duration: 5,
      });

      if (autoPlayVoice && 'speechSynthesis' in window) {
        const text = `请${item.number}号，${item.applicantName}，前往${item.windowNumber || '1号窗口'}办理业务。`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleCreateSuccess = (caseNumber: string, queueNumber: string) => {
    api.success({
      message: '建单成功',
      description: (
        <div className="space-y-1">
          <p className="!m-0">
            办件编号：<span className="font-mono font-medium">{caseNumber}</span>
          </p>
          <p className="!m-0">
            排队号码：
            <Tag color="blue" className="!m-0 font-mono">
              {queueNumber}
            </Tag>
          </p>
        </div>
      ),
      icon: <ListPlus className="h-6 w-6 text-green-500" />,
      duration: 5,
    });
  };

  return (
    <>
      {contextHolder}
      <PageLayout
        className={className}
        title="叫号接件"
        subtitle="出生一件事联办工作台 · 队列管理与快速建单"
        activeNav="call-receive"
        breadcrumb={[
          { title: '首页' },
          { title: '工作台' },
          { title: '叫号接件' },
        ]}
      >
        <div className="flex h-full flex-col gap-5">
          <Row gutter={16}>
            <Col xs={12} sm={6}>
              <Card className="!rounded-xl !border-slate-200" styles={{ body: { padding: 16 } }}>
                <Statistic
                  title={
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      等待中
                    </span>
                  }
                  value={getWaitingCount()}
                  suffix="人"
                  valueStyle={{ color: '#d97706', fontSize: 28, fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="!rounded-xl !border-slate-200" styles={{ body: { padding: 16 } }}>
                <Statistic
                  title={
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <BellRing className="h-4 w-4" />
                      呼叫中
                    </span>
                  }
                  value={callingCount}
                  suffix="人"
                  valueStyle={{ color: '#2563eb', fontSize: 28, fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="!rounded-xl !border-slate-200" styles={{ body: { padding: 16 } }}>
                <Statistic
                  title={
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <UserCheck className="h-4 w-4" />
                      办理中
                    </span>
                  }
                  value={servingCount}
                  suffix="人"
                  valueStyle={{ color: '#0891b2', fontSize: 28, fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="!rounded-xl !border-slate-200" styles={{ body: { padding: 16 } }}>
                <Statistic
                  title={
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <CheckCircle2 className="h-4 w-4" />
                      已完成
                    </span>
                  }
                  value={completedCount}
                  suffix="人"
                  valueStyle={{ color: '#059669', fontSize: 28, fontWeight: 700 }}
                />
              </Card>
            </Col>
          </Row>

          {(currentCalling || currentServing) && (
            <Card
              className={cn(
                '!rounded-xl !border-2 overflow-hidden',
                currentCalling
                  ? '!border-blue-200 !bg-gradient-to-r !from-blue-50 !to-white'
                  : '!border-cyan-200 !bg-gradient-to-r !from-cyan-50 !to-white',
              )}
              styles={{ body: { padding: 0 } }}
            >
              <div className="flex items-stretch">
                {currentCalling && (
                  <div className="flex-1 flex items-center gap-6 p-5">
                    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                      <span className="text-xs font-medium opacity-75">呼叫中</span>
                      <span className="text-3xl font-bold leading-none mt-1">
                        {currentCalling.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-slate-800">
                          {currentCalling.applicantName}
                        </span>
                        {missedCount > 0 && (
                          <Tag color="orange" className="!m-0">
                            第{currentCalling.callCount}次呼叫
                          </Tag>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mb-1 truncate">
                        {currentCalling.serviceType}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <Tag color="purple" className="!m-0">
                          {currentCalling.windowNumber}
                        </Tag>
                        <span className="text-slate-400">
                          {currentCalling.calledTime &&
                            dayjs(currentCalling.calledTime).format('HH:mm:ss') + ' 呼叫'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setAutoPlayVoice(!autoPlayVoice)}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                        autoPlayVoice
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200',
                      )}
                      title={autoPlayVoice ? '关闭语音播报' : '开启语音播报'}
                    >
                      {autoPlayVoice ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                )}
                {currentCalling && currentServing && (
                  <Divider type="vertical" className="!h-auto !my-5 !text-slate-200" />
                )}
                {currentServing && (
                  <div className="flex-1 flex items-center gap-6 p-5">
                    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-200">
                      <span className="text-xs font-medium opacity-75">办理中</span>
                      <span className="text-3xl font-bold leading-none mt-1">
                        {currentServing.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-cyan-500" />
                        <span className="font-semibold text-slate-800">
                          {currentServing.applicantName}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-1 truncate">
                        {currentServing.serviceType}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <Tag color="cyan" className="!m-0">
                          {currentServing.windowNumber}
                        </Tag>
                        <span className="text-slate-400">
                          {currentServing.servedTime &&
                            dayjs(currentServing.servedTime).format('HH:mm:ss') + ' 开始办理'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Row gutter={20} className="flex-1 min-h-0">
            <Col xs={24} xl={12} className="h-full">
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-slate-800">叫号队列</span>
                    <Tag color="blue" className="ml-2 !m-0">
                      共 {queueList.length} 条
                    </Tag>
                  </div>
                }
                className="h-full !rounded-xl !border-slate-200 flex flex-col"
                styles={{
                  body: {
                    padding: 0,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                  },
                }}
                headStyle={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}
              >
                <div className="p-4 flex-1 min-h-0">
                  <QueueList onCallNextSuccess={handleCallNextSuccess} />
                </div>
              </Card>
            </Col>
            <Col xs={24} xl={12} className="h-full">
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                      <ListPlus className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-slate-800">快速建单</span>
                    <span className="ml-2 text-xs text-slate-400">新建办件并自动取号</span>
                  </div>
                }
                className="h-full !rounded-xl !border-slate-200 flex flex-col"
                styles={{
                  body: {
                    padding: 0,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                  },
                }}
                headStyle={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}
              >
                <div className="p-4 flex-1 min-h-0">
                  <QuickCreate onSuccess={handleCreateSuccess} />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </PageLayout>
    </>
  );
}
