import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
  Autocomplete
} from '@mui/material'
import { ArrowBack, Add, Edit, Delete } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import store from '@renderer/store'
import { MaterialItem } from '@renderer/types'

interface MaterialManagementProps {
  onBack: () => void
}

export default function MaterialManagement({ onBack }: MaterialManagementProps): React.JSX.Element {
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<MaterialItem | null>(null)
  const [formData, setFormData] = useState({
    department: '',
    workArea: '',
    instrumentName: '',
    specification: '',
    custodian: '',
    quantity: '',
    remark: ''
  })

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = async (): Promise<void> => {
    const data = await store.get('materials')
    if (data) {
      setMaterials(data as MaterialItem[])
    } else {
      setMaterials([])
    }
  }

  const getUniqueDepartments = (): string[] => {
    const departments = materials.map((item) => item.department).filter(Boolean)
    return Array.from(new Set(departments))
  }

  const getUniqueWorkAreas = (): string[] => {
    const workAreas = materials.map((item) => item.workArea).filter(Boolean)
    return Array.from(new Set(workAreas))
  }

  const getUniqueCustodians = (): string[] => {
    const custodians = materials.map((item) => item.custodian).filter(Boolean)
    return Array.from(new Set(custodians))
  }

  const saveMaterials = async (newMaterials: MaterialItem[]): Promise<void> => {
    setMaterials(newMaterials)
    await store.set('materials', newMaterials)
  }

  const handleAdd = (): void => {
    setEditingItem(null)
    setFormData({
      department: '',
      workArea: '',
      instrumentName: '',
      specification: '',
      custodian: '',
      quantity: '',
      remark: ''
    })
    setOpenDialog(true)
  }

  const handleEdit = (item: MaterialItem): void => {
    setEditingItem(item)
    setFormData({
      department: item.department,
      workArea: item.workArea,
      instrumentName: item.instrumentName,
      specification: item.specification,
      custodian: item.custodian,
      quantity: item.quantity.toString(),
      remark: item.remark
    })
    setOpenDialog(true)
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('确定要删除这条记录吗？')) {
      const newMaterials = materials.filter((item) => item.id !== id)
      await saveMaterials(newMaterials)
    }
  }

  const handleSave = async (): Promise<void> => {
    const quantity = parseFloat(formData.quantity)
    if (isNaN(quantity) || quantity < 0) {
      alert('请输入有效的数量')
      return
    }

    if (editingItem) {
      const updatedMaterials = materials.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              department: formData.department,
              workArea: formData.workArea,
              instrumentName: formData.instrumentName,
              specification: formData.specification,
              custodian: formData.custodian,
              quantity: quantity,
              remark: formData.remark
            }
          : item
      )
      await saveMaterials(updatedMaterials)
    } else {
      const newItem: MaterialItem = {
        id: Date.now().toString(),
        department: formData.department,
        workArea: formData.workArea,
        instrumentName: formData.instrumentName,
        specification: formData.specification,
        custodian: formData.custodian,
        quantity: quantity,
        remark: formData.remark
      }
      await saveMaterials([...materials, newItem])
    }
    setOpenDialog(false)
  }

  const handleCancel = (): void => {
    setOpenDialog(false)
    setEditingItem(null)
  }

  return (
    <div className="min-h-full overflow-y-auto px-10 pb-20">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">物资统筹管理</h2>
        <div className="flex gap-4">
          <Button startIcon={<Add />} onClick={handleAdd} variant="contained" size="large">
            新增
          </Button>
          <Button startIcon={<ArrowBack />} onClick={onBack} variant="outlined" size="large">
            返回
          </Button>
        </div>
      </div>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>序号</TableCell>
              <TableCell>科室/车间名称</TableCell>
              <TableCell>工区名称</TableCell>
              <TableCell>仪表名称</TableCell>
              <TableCell>规格型号</TableCell>
              <TableCell>保管人</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>备注</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              materials.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.workArea}</TableCell>
                  <TableCell>{item.instrumentName}</TableCell>
                  <TableCell>{item.specification}</TableCell>
                  <TableCell>{item.custodian}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.remark}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEdit(item)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>{editingItem ? '编辑物资' : '新增物资'}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-4">
            <Autocomplete
              freeSolo
              options={getUniqueDepartments()}
              inputValue={formData.department}
              onInputChange={(_, newValue) => {
                setFormData({ ...formData, department: newValue })
              }}
              renderInput={(params) => <TextField {...params} label="科室/车间名称" required />}
            />
            <Autocomplete
              freeSolo
              options={getUniqueWorkAreas()}
              inputValue={formData.workArea}
              onInputChange={(_, newValue) => {
                setFormData({ ...formData, workArea: newValue })
              }}
              renderInput={(params) => <TextField {...params} label="工区名称" required />}
            />
            <TextField
              label="仪表名称"
              value={formData.instrumentName}
              onChange={(e) => setFormData({ ...formData, instrumentName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="规格型号"
              value={formData.specification}
              onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
              fullWidth
              required
            />
            <Autocomplete
              freeSolo
              options={getUniqueCustodians()}
              inputValue={formData.custodian}
              onInputChange={(_, newValue) => {
                setFormData({ ...formData, custodian: newValue })
              }}
              renderInput={(params) => <TextField {...params} label="保管人" required />}
            />
            <TextField
              label="数量"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 0, step: 1 }}
            />
            <TextField
              label="备注"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
