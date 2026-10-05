const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock cases and complex relationships...');

  // Create an Investigator User if not exists
  let admin = await prisma.user.findUnique({ where: { email: 'admin@cyber' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@cyber',
        password: 'password', // fake password
        role: 'ADMIN',
      }
    });
  }

  console.log('Clearing old data (except users)...');
  await prisma.caseEntity.deleteMany({});
  await prisma.evidenceEntity.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.entity.deleteMany({});
  await prisma.case.deleteMany({});

  console.log('Creating Shared Entities...');
  // These entities will bridge multiple cases
  const sharedPhone = await prisma.entity.create({ data: { type: 'PHONE', value: '+919876543210', normalizedValue: '919876543210' } });
  const sharedIp = await prisma.entity.create({ data: { type: 'IP_ADDRESS', value: '103.247.192.88', normalizedValue: '103.247.192.88' } });
  const sharedBank = await prisma.entity.create({ data: { type: 'BANK_ACCOUNT', value: 'HDFC000123456789', normalizedValue: 'HDFC000123456789' } });
  
  // Isolated entities
  const isolatedPhone = await prisma.entity.create({ data: { type: 'PHONE', value: '+919999999999', normalizedValue: '919999999999' } });
  const isolatedUpi = await prisma.entity.create({ data: { type: 'UPI', value: 'fraudster@ybl', normalizedValue: 'fraudster@ybl' } });

  console.log('Creating Cases & Evidence...');
  
  // Case 1: UPI Fraud (Linked to sharedPhone and sharedBank)
  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'CF-2026-001',
      title: 'Massive UPI QR Code Scam',
      description: 'Victim scanned a QR code from a fake marketplace listing and lost 2 Lakh INR. The funds were immediately transferred to multiple accounts.',
      fraudType: 'UPI Fraud',
      victimName: 'Rahul Sharma',
      victimPhone: '9876543210',
      fraudAmount: 200000,
      status: 'ACTIVE',
      priority: 'HIGH',
      location: 'Mumbai, MH',
      incidentDate: new Date('2026-09-15'),
      createdById: admin.id,
      evidence: {
        create: [
          { fileName: 'bank_statement_rahul.pdf', fileUrl: 'mock', fileType: 'application/pdf', evidenceType: 'BANK_STATEMENT', uploadedBy: admin.id },
          { fileName: 'whatsapp_chats.csv', fileUrl: 'mock', fileType: 'text/csv', evidenceType: 'CHAT_LOG', uploadedBy: admin.id }
        ]
      },
      caseEntities: {
        create: [
          { entityId: sharedPhone.id },
          { entityId: sharedBank.id },
          { entityId: isolatedUpi.id }
        ]
      }
    }
  });

  // Case 2: Telecom Phishing (Linked to sharedPhone and sharedIp)
  const case2 = await prisma.case.create({
    data: {
      caseNumber: 'CF-2026-002',
      title: 'Telecom KYC Update Phishing',
      description: 'Victim received a fake SMS asking to update KYC. They clicked a link and their SIM was swapped.',
      fraudType: 'Telecom Fraud',
      victimName: 'Anita Desai',
      fraudAmount: 55000,
      status: 'ACTIVE',
      priority: 'MEDIUM',
      location: 'Pune, MH',
      incidentDate: new Date('2026-09-20'),
      createdById: admin.id,
      evidence: {
        create: [
          { fileName: 'sms_headers.txt', fileUrl: 'mock', fileType: 'text/plain', evidenceType: 'OTHER', uploadedBy: admin.id },
          { fileName: 'ipdr_logs.csv', fileUrl: 'mock', fileType: 'text/csv', evidenceType: 'IPDR', uploadedBy: admin.id }
        ]
      },
      caseEntities: {
        create: [
          { entityId: sharedPhone.id },
          { entityId: sharedIp.id },
          { entityId: isolatedPhone.id }
        ]
      }
    }
  });

  // Case 3: Corporate Wire Fraud (Linked to sharedBank and sharedIp)
  const case3 = await prisma.case.create({
    data: {
      caseNumber: 'CF-2026-003',
      title: 'Corporate Email Compromise (BEC)',
      description: 'Company accountants were tricked into wiring funds to an offshore account disguised as a vendor.',
      fraudType: 'Corporate Fraud',
      victimName: 'TechCorp India',
      fraudAmount: 1500000,
      status: 'ACTIVE',
      priority: 'CRITICAL',
      location: 'Bengaluru, KA',
      incidentDate: new Date('2026-10-01'),
      createdById: admin.id,
      evidence: {
        create: [
          { fileName: 'server_access_logs.log', fileUrl: 'mock', fileType: 'text/plain', evidenceType: 'IPDR', uploadedBy: admin.id },
          { fileName: 'wire_transfer_receipt.pdf', fileUrl: 'mock', fileType: 'application/pdf', evidenceType: 'BANK_STATEMENT', uploadedBy: admin.id }
        ]
      },
      caseEntities: {
        create: [
          { entityId: sharedBank.id },
          { entityId: sharedIp.id }
        ]
      }
    }
  });

  console.log('Seed completed successfully!');
  console.log(`Created 3 cases, 5 entities, and 8 complex relationships.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
