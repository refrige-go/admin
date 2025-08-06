import { Button } from '../ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table'

/**
 * 회원 테이블 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.members - 회원 데이터 배열
 * @param {Function} props.onViewDetail - 상세보기 클릭 핸들러
 * @returns {JSX.Element} MemberTable 컴포넌트
 */
export function MemberTable({ members = [], onViewDetail = () => {} }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-[#dfe1e3]">
          <TableHead className="text-[#404040] font-medium py-3 px-4">이메일</TableHead>
          <TableHead className="text-[#404040] font-medium py-3 px-4">닉네임</TableHead>
          <TableHead className="text-[#404040] font-medium py-3 px-4">성별</TableHead>
          <TableHead className="text-[#404040] font-medium py-3 px-4">가입일</TableHead>
          <TableHead className="text-[#404040] font-medium py-3 px-4">권한</TableHead>
          <TableHead className="text-[#404040] font-medium py-3 px-4">상태</TableHead>
          <TableHead className="text-[#404040] font-medium py-3 px-4"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => (
          <TableRow key={index} className="border-b border-[#dfe1e3] hover:bg-gray-50">
            <TableCell className="py-3 px-4 text-[#000000]">{member.email}</TableCell>
            <TableCell className="py-3 px-4 text-[#000000]">{member.nickname}</TableCell>
            <TableCell className="py-3 px-4 text-[#000000]">{member.gender}</TableCell>
            <TableCell className="py-3 px-4 text-[#000000]">{member.joinDate}</TableCell>
            <TableCell className="py-3 px-4 text-[#000000]">{member.permission}</TableCell>
            <TableCell className="py-3 px-4 text-[#000000]">{member.status}</TableCell>
            <TableCell className="py-3 px-4">
              <Button 
                size="sm" 
                className="bg-[#f9bf52] hover:bg-[#e6a94a] text-[#2d1b0a] rounded-full px-4"
                onClick={() => onViewDetail(member)}
              >
                자세히
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 