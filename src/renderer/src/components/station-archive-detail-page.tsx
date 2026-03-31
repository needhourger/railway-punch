import { ArrowBack } from '@mui/icons-material'
import { Button, Card, Typography } from '@mui/material'
import React from 'react'

interface StationArchiveDetailPageProps {
  stationName: string
  onBack: () => void
}

interface StationDetailBasicInfo {
  powerScreenModel: string
  deviceName: string
  powerSupplyMode: string
  panelCount: number
  capacityKva: string
  manufacturer: string
  commissionDate: string
  surgeProtectorBreakerCapacityA: number
  acContactorModel: string
  acContactorCount: number
}

interface StationDetailAutonomousAndInterlock {
  autonomousCommissionDate: string
  autonomousModel: string
  integrator: string
  interlockingType: string
  trainControlType: string
  serialPortMode: string
  hasIntervalSelfCollection: boolean
  enabledFunctions: string
  operationMode: string
  hasCenterChannel: boolean
}

interface StationDetailNetworkSecurity {
  securityVersion: string
  securityBoundaryModel: string
  securityPolicy: string
  channelType: string
  hasDualChannel: boolean
  hasDualTransmission: boolean
  channelQualitySupervisionType: string
  commQualityUnitModel: string
}

interface StationDetailRouterAndSwitch {
  routerModel: string
  routerCount: number
  routerInterface1: string
  routerInterface2: string
  eigrpOrOspfArea: string
  switchModel: string
  switchCount: number
}

interface StationDetailTerminalAndMaintenance {
  terminalModel: string
  terminalTotalCount: string
  repairMachineCount: number
  terminalDualNic: boolean
  terminalMemory: string
  terminalOs: string
  longDriveModel: string
  longDrivePairCount: number
  maintenanceTerminalOs: string
  maintenanceLocalPlayback: boolean
  maintenanceSoftware: string
}

interface StationDetailPeripherals {
  printerModel: string
  upsType: string
  upsCount: number
}

interface StationDetailInspection {
  annualInspectionDate: string
  electronicCentralizedRepairDate: string
}

interface StationDetail {
  basicInfo: StationDetailBasicInfo
  autonomousAndInterlock: StationDetailAutonomousAndInterlock
  networkSecurity: StationDetailNetworkSecurity
  routerAndSwitch: StationDetailRouterAndSwitch
  terminalAndMaintenance: StationDetailTerminalAndMaintenance
  peripherals: StationDetailPeripherals
  inspection: StationDetailInspection
}

const stationDetailByName: Record<string, StationDetail> = {
  新河镇: {
    basicInfo: {
      powerScreenModel: 'PUZ2-30/3',
      deviceName: '站内屏',
      powerSupplyMode: 'Y型供电',
      panelCount: 4,
      capacityKva: '30KVA',
      manufacturer: '固信康达轨道交通技术开发有限公司',
      commissionDate: '2023-11',
      surgeProtectorBreakerCapacityA: 60,
      acContactorModel: '3TF47',
      acContactorCount: 2
    },
    autonomousAndInterlock: {
      autonomousCommissionDate: '2023-11',
      autonomousModel: 'TDCS-T(C40)（含2.0和3.0）',
      integrator: '通号',
      interlockingType: 'TYJL-III',
      trainControlType: '无',
      serialPortMode: '232/422',
      hasIntervalSelfCollection: false,
      enabledFunctions: 'TDCS',
      operationMode: '非常站控',
      hasCenterChannel: false
    },
    networkSecurity: {
      securityVersion: 'V2.0',
      securityBoundaryModel: 'XDHY-FW-20',
      securityPolicy: '严格',
      channelType: '2M',
      hasDualChannel: true,
      hasDualTransmission: false,
      channelQualitySupervisionType: '2M',
      commQualityUnitModel: 'DLMU-100'
    },
    routerAndSwitch: {
      routerModel: 'cisco 4321',
      routerCount: 2,
      routerInterface1: 'NIM-WIC',
      routerInterface2: 'NIM-WIC',
      eigrpOrOspfArea: 'OSPF 121',
      switchModel: 'cisco 2960',
      switchCount: 2
    },
    terminalAndMaintenance: {
      terminalModel: '研华ACP-2000',
      terminalTotalCount: '3（远端1）',
      repairMachineCount: 1,
      terminalDualNic: true,
      terminalMemory: '8G',
      terminalOs: 'Windows 7',
      longDriveModel: 'TH-0FKVM2000',
      longDrivePairCount: 1,
      maintenanceTerminalOs: 'Windows 7',
      maintenanceLocalPlayback: false,
      maintenanceSoftware: '运维'
    },
    peripherals: {
      printerModel: 'HP405',
      upsType: '小型',
      upsCount: 4
    },
    inspection: {
      annualInspectionDate: '2023-11',
      electronicCentralizedRepairDate: '2023-11'
    }
  }
}

interface DetailItem {
  label: string
  value: React.ReactNode
}

interface DetailSectionProps {
  title: string
  items: DetailItem[]
}

function DetailSection({ title, items }: DetailSectionProps): React.JSX.Element {
  return (
    <Card className="mb-5 p-5">
      <Typography variant="h6" className="mb-3 font-semibold">
        {title}
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-sm text-gray-400">{item.label}</span>
            <span className="text-base text-gray-100 break-words">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function StationArchiveDetailPage({
  stationName,
  onBack
}: StationArchiveDetailPageProps): React.JSX.Element {
  const detail = stationDetailByName[stationName]

  return (
    <div className="w-full h-full max-w-5xl mx-auto px-10 pb-6 flex flex-col">
      <div className="mb-4 flex-shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{stationName}</h2>
          {detail && (
            <Typography variant="body2" className="mt-1 text-gray-300">
              {detail.basicInfo.powerScreenModel} · {detail.basicInfo.powerSupplyMode} ·{' '}
              {detail.basicInfo.capacityKva} · {detail.basicInfo.manufacturer}
            </Typography>
          )}
        </div>
        <Button startIcon={<ArrowBack />} onClick={onBack} variant="outlined" size="large">
          返回站点列表
        </Button>
      </div>
      {!detail ? (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Card className="p-12">
            <Typography variant="h6" className="mb-2">
              {stationName} 详细数据
            </Typography>
            <Typography variant="body1" color="text.secondary">
              当前站点暂无详细档案数据，可后续补充。
            </Typography>
          </Card>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-0 pb-4">
            <DetailSection
              title="基础信息"
              items={[
                { label: '站名', value: stationName },
                { label: '电源屏型号', value: detail.basicInfo.powerScreenModel },
                { label: '设备名称', value: detail.basicInfo.deviceName },
                { label: '供电方式', value: detail.basicInfo.powerSupplyMode },
                { label: '屏面数', value: detail.basicInfo.panelCount },
                { label: '电源屏容量', value: detail.basicInfo.capacityKva },
                { label: '生产厂家', value: detail.basicInfo.manufacturer },
                { label: '上道时间', value: detail.basicInfo.commissionDate },
                {
                  label: '电源防雷箱空开容量(A)',
                  value: `${detail.basicInfo.surgeProtectorBreakerCapacityA}A`
                },
                {
                  label: '交流接触器',
                  value: `${detail.basicInfo.acContactorModel} × ${detail.basicInfo.acContactorCount}`
                }
              ]}
            />
            <DetailSection
              title="自律机与联锁列控"
              items={[
                {
                  label: '自律机上道年月',
                  value: detail.autonomousAndInterlock.autonomousCommissionDate
                },
                {
                  label: '自律机（分机）型号',
                  value: detail.autonomousAndInterlock.autonomousModel
                },
                { label: '集成商', value: detail.autonomousAndInterlock.integrator },
                { label: '联锁类型', value: detail.autonomousAndInterlock.interlockingType },
                { label: '列控类型', value: detail.autonomousAndInterlock.trainControlType },
                { label: '外接串口方式', value: detail.autonomousAndInterlock.serialPortMode },
                {
                  label: '是否有区间自采集',
                  value: detail.autonomousAndInterlock.hasIntervalSelfCollection ? '是' : '否'
                },
                { label: '开通功能', value: detail.autonomousAndInterlock.enabledFunctions },
                { label: '操作方式', value: detail.autonomousAndInterlock.operationMode },
                {
                  label: '是否回中心通道',
                  value: detail.autonomousAndInterlock.hasCenterChannel ? '是' : '否'
                }
              ]}
            />
            <DetailSection
              title="网络安全与通道"
              items={[
                { label: '网络安全版本', value: detail.networkSecurity.securityVersion },
                { label: '安全边界型号', value: detail.networkSecurity.securityBoundaryModel },
                { label: '网络安全策略', value: detail.networkSecurity.securityPolicy },
                { label: '通道类型', value: detail.networkSecurity.channelType },
                {
                  label: '是否双通道',
                  value: detail.networkSecurity.hasDualChannel ? '是' : '否'
                },
                {
                  label: '是否实现双路传输',
                  value: detail.networkSecurity.hasDualTransmission ? '是' : '否'
                },
                {
                  label: '通道质量监督类型',
                  value: detail.networkSecurity.channelQualitySupervisionType
                },
                {
                  label: '通信质量监督单元型号',
                  value: detail.networkSecurity.commQualityUnitModel
                }
              ]}
            />
            <DetailSection
              title="路由器与交换机"
              items={[
                { label: '路由器型号', value: detail.routerAndSwitch.routerModel },
                { label: '路由器数量', value: detail.routerAndSwitch.routerCount },
                { label: '路由接口1', value: detail.routerAndSwitch.routerInterface1 },
                { label: '路由接口2', value: detail.routerAndSwitch.routerInterface2 },
                { label: 'EIGRP/OSPF域号', value: detail.routerAndSwitch.eigrpOrOspfArea },
                { label: '交换机型号', value: detail.routerAndSwitch.switchModel },
                { label: '交换机数量', value: detail.routerAndSwitch.switchCount }
              ]}
            />
            <DetailSection
              title="终端与维护终端"
              items={[
                { label: '终端型号', value: detail.terminalAndMaintenance.terminalModel },
                {
                  label: '终端总数量（括号内写远端）',
                  value: detail.terminalAndMaintenance.terminalTotalCount
                },
                { label: '维修机数量', value: detail.terminalAndMaintenance.repairMachineCount },
                {
                  label: '终端是否双网卡',
                  value: detail.terminalAndMaintenance.terminalDualNic ? '是' : '否'
                },
                { label: '终端内存容量', value: detail.terminalAndMaintenance.terminalMemory },
                { label: '终端操作系统', value: detail.terminalAndMaintenance.terminalOs },
                { label: '长驱型号', value: detail.terminalAndMaintenance.longDriveModel },
                { label: '长驱数量(对)', value: detail.terminalAndMaintenance.longDrivePairCount },
                {
                  label: '维护终端操作系统',
                  value: detail.terminalAndMaintenance.maintenanceTerminalOs
                },
                {
                  label: '维护终端本地回放功能',
                  value: detail.terminalAndMaintenance.maintenanceLocalPlayback ? '是' : '否'
                },
                {
                  label: '维护终端维护软件功能',
                  value: detail.terminalAndMaintenance.maintenanceSoftware
                }
              ]}
            />
            <DetailSection
              title="外设与供电保障"
              items={[
                { label: '打印机型号', value: detail.peripherals.printerModel },
                { label: 'UPS类型', value: detail.peripherals.upsType },
                { label: 'UPS数量', value: detail.peripherals.upsCount }
              ]}
            />
            <DetailSection
              title="年检与集中修"
              items={[
                { label: '年检时间', value: detail.inspection.annualInspectionDate },
                {
                  label: '电子集中修时间',
                  value: detail.inspection.electronicCentralizedRepairDate
                }
              ]}
            />
          </div>
        </div>
      )}
    </div>
  )
}
