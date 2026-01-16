import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { AccountBalance, Assessment, BarChart, Inventory } from '@mui/icons-material'
import React from 'react'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export default function HomePage({ onNavigate }: HomePageProps): React.JSX.Element {
  const menuItems = [
    {
      id: 'financial-points',
      title: '财务积分管理',
      icon: AccountBalance,
      description: '用户选择和考勤记录管理'
    },
    {
      id: 'attendance-analysis',
      title: '考勤数据分析',
      icon: Assessment,
      description: '考勤数据统计与分析'
    },
    {
      id: 'annual-report',
      title: '年度统计报表',
      icon: BarChart,
      description: '年度数据报表生成'
    },
    {
      id: 'material-management',
      title: '物资统筹管理',
      icon: Inventory,
      description: '物资统筹与管理'
    }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardActionArea onClick={() => onNavigate(item.id)} className="h-full p-6">
                <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
                  <IconComponent fontSize="large" className="mb-4" style={{ fontSize: 64 }} />
                  <Typography variant="h5" component="div" className="mb-2 font-bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="text-center">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
