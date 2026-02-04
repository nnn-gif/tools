import AppLayout from '../layouts/AppLayout.vue'
import HomeView from '../views/HomeView.vue'
import MarkdownView from '../views/MarkdownView.vue'

export const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: {
          title: 'Formatho - Privacy-First Developer Tools',
          description:
            'Fast, secure, privacy-first collection of online text formatting tools, developer utilities, and content productivity tools.',
          keywords:
            'developer tools, text formatter, json formatter, privacy-first tools, online utilities'
        }
      },
      {
        path: 'markdown',
        name: 'markdown',
        component: MarkdownView,
        meta: {
          title: 'Markdown Editor',
          description:
            'Edit and preview Markdown files in real-time. Privacy-first markdown editor that runs 100% client-side in your browser.',
          keywords:
            'markdown editor, markdown preview, markdown viewer, github markdown, privacy-first'
        }
      },
      {
        path: 'json-yaml',
        name: 'json-yaml',
        component: () => import('../views/JsonYamlView.vue'),
        meta: {
          title: 'JSON to YAML Converter',
          description:
            'Convert JSON to YAML and YAML to JSON instantly. Free, privacy-first converter that processes data entirely in your browser.',
          keywords:
            'json to yaml, yaml to json, json converter, yaml converter, json yaml, privacy-first'
        }
      },
      {
        path: 'json-csv',
        name: 'json-csv',
        component: () => import('../views/JsonCsvView.vue'),
        meta: {
          title: 'JSON to CSV Converter',
          description:
            'Convert JSON to CSV and CSV to JSON format instantly. Free, client-side converter that keeps your data private.',
          keywords:
            'json to csv, csv to json, json converter, csv converter, json csv, privacy-first'
        }
      },
      {
        path: 'diff',
        name: 'diff',
        component: () => import('../views/DiffView.vue'),
        meta: {
          title: 'Text Diff Tool',
          description:
            'Compare two texts and see the differences highlighted. Free diff tool that runs entirely in your browser.',
          keywords:
            'diff tool, text diff, compare text, diff checker, text comparison, privacy-first'
        }
      },
      {
        path: 'base64',
        name: 'base64',
        component: () => import('../views/Base64View.vue'),
        meta: {
          title: 'Base64 Encoder & Decoder',
          description:
            'Encode and decode Base64 strings instantly. Free, privacy-first Base64 tool that processes data entirely in your browser.',
          keywords:
            'base64 encoder, base64 decoder, base64 encode, base64 decode, base64 converter, privacy-first'
        }
      },
      {
        path: 'jwt',
        name: 'jwt',
        component: () => import('../views/JwtView.vue'),
        meta: {
          title: 'JWT Decoder',
          description:
            'Decode and inspect JWT tokens instantly. View JWT header, payload, and signature. Privacy-first tool that runs in your browser.',
          keywords:
            'jwt decoder, jwt decode, jwt token decoder, jwt inspector, json web token, privacy-first'
        }
      },
      {
        path: 'sql',
        name: 'sql',
        component: () => import('../views/SqlFormatterView.vue'),
        meta: {
          title: 'SQL Formatter',
          description:
            'Format and beautify SQL queries instantly. Free SQL formatter that runs entirely in your browser. Supports multiple SQL dialects.',
          keywords:
            'sql formatter, sql beautifier, sql prettifier, format sql, sql formatter online, privacy-first'
        }
      },
      {
        path: 'uuid',
        name: 'uuid',
        component: () => import('../views/UuidGeneratorView.vue'),
        meta: {
          title: 'UUID Generator',
          description:
            'Generate UUIDs (Universally Unique Identifiers) instantly. Free UUID generator that creates v1, v4, and other UUID formats.',
          keywords:
            'uuid generator, generate uuid, uuid v4, uuid v1, unique identifier generator, privacy-first'
        }
      },
      {
        path: 'lorem',
        name: 'lorem',
        component: () => import('../views/LoremIpsumView.vue'),
        meta: {
          title: 'Lorem Ipsum Generator',
          description:
            'Generate Lorem Ipsum placeholder text instantly. Customize paragraphs, words, and sentences. Free text generator.',
          keywords:
            'lorem ipsum generator, placeholder text, dummy text generator, lorem ipsum, privacy-first'
        }
      },
      {
        path: 'image',
        name: 'image',
        component: () => import('../views/ImageCompressorView.vue'),
        meta: {
          title: 'Image Compressor',
          description:
            'Compress and optimize images instantly. Reduce image file size while maintaining quality. Privacy-first tool that processes images in your browser.',
          keywords:
            'image compressor, compress image, image optimizer, reduce image size, image compression, privacy-first'
        }
      },
      {
        path: 'json-lint',
        name: 'json-lint',
        component: () => import('../views/JsonLintView.vue'),
        meta: {
          title: 'JSON Linter & Validator',
          description:
            'Validate and lint JSON code instantly. Find syntax errors and format JSON. Free JSON validator that runs entirely in your browser.',
          keywords:
            'json linter, json validator, json formatter, validate json, json checker, privacy-first'
        }
      },
      {
        path: 'yaml-lint',
        name: 'yaml-lint',
        component: () => import('../views/YamlLintView.vue'),
        meta: {
          title: 'YAML Linter & Validator',
          description:
            'Validate and lint YAML code instantly. Find syntax errors and format YAML. Free YAML validator that runs entirely in your browser.',
          keywords:
            'yaml linter, yaml validator, yaml formatter, validate yaml, yaml checker, privacy-first'
        }
      },
      {
        path: 'bpmn',
        name: 'bpmn',
        component: () => import('../views/BpmnView.vue'),
        meta: {
          title: 'BPMN Viewer & PDF Exporter',
          description:
            'Visualize BPMN 2.0 diagrams and export them as PDF. Free, privacy-first BPMN viewer that runs entirely in your browser.',
          keywords:
            'bpmn viewer, bpmn to pdf, bpmn diagram, business process model, bpmn export, privacy-first'
        }
      },
      {
        path: 'evm-converter',
        name: 'evm-converter',
        component: () => import('../views/EvmUnitConverterView.vue'),
        meta: {
          title: 'EVM Unit Converter',
          description:
            'Convert between Wei, Gwei, and Ether instantly. Essential tool for Ethereum developers.',
          keywords:
            'ethereum unit converter, wei converter, gwei converter, ether converter, evm tools'
        }
      },
      {
        path: 'keccak256',
        name: 'keccak256',
        component: () => import('../views/KeccakHasherView.vue'),
        meta: {
          title: 'Keccak-256 Hasher',
          description:
            'Generate Keccak-256 hashes online. Secure, client-side hashing for Ethereum development.',
          keywords: 'keccak256 hash, keccak256 online, ethereum hash, solidity keccak256'
        }
      },
      {
        path: 'address-checksum',
        name: 'address-checksum',
        component: () => import('../views/AddressChecksumView.vue'),
        meta: {
          title: 'Address Checksum (EIP-55)',
          description:
            'Validate and checksum Ethereum addresses (EIP-55). Ensure correct address formatting.',
          keywords: 'ethereum address checksum, eip-55 checksum, address validator, connect wallet'
        }
      },
      {
        path: 'multi-chain-keys',
        name: 'multi-chain-keys',
        component: () => import('../views/MultiChainKeyGeneratorView.vue'),
        meta: {
          title: 'Multi-Chain Key Generator',
          description:
            'Generate keys for Ethereum, Solana, Polkadot, and Cosmos from one mnemonic. Understand the algorithms.',
          keywords:
            'multi chain wallet, key generator, ethereum, solana, polkadot, cosmos, bip39, ed25519, secp256k1'
        }
      },
      {
        path: 'address-from-key',
        name: 'address-from-key',
        component: () => import('../views/AddressFromPrivateKeyView.vue'),
        meta: {
          title: 'Address from Private Key (Multi-Chain)',
          description:
            'Derive addresses for Ethereum, Bitcoin, Solana, and more from a private key. Runs entirely in browser.',
          keywords:
            'private key to address, eth address, btc address, solana address, multi chain tool'
        }
      },
      {
        path: 'solidity-to-opcodes',
        name: 'solidity-to-opcodes',
        component: () => import('../views/SolidityToOpcodesView.vue'),
        meta: {
          title: 'Solidity to EVM Opcodes',
          description:
            'Compile Solidity to EVM Opcodes and Bytecode in your browser. View the assembly of your smart contracts.',
          keywords:
            'solidity compile, evm opcodes, smart contract assembly, solidity bytecode, compiler'
        }
      },
      {
        path: 'agent-identity',
        name: 'agent-identity',
        component: () => import('../views/AgentIdentityView.vue'),
        meta: {
          title: 'ERC-8004 Agent Identity Generator',
          description:
            'Generate standard-compliant JSON metadata for AI Agents (ERC-8004). Define identity, capabilities, and endpoints.',
          keywords:
            'erc-8004, ai agent identity, agent metadata, crypto ai, autonomous agents, json generator'
        }
      },
      {
        path: 'agents',
        name: 'agents',
        component: () => import('../views/AgentsView.vue'),
        meta: {
          title: 'Agent Browser - Blockchain Agents with Reputation',
          description:
            'Explore AI Agents on the blockchain with reputation tracking. View agent addresses, reputation scores, and activity. Real-time data from the blockchain.',
          keywords:
            'agent browser, blockchain agents, ai agents reputation, crypto agents, ethereum agents, agent explorer, reputation tracking'
        }
      }
    ]
  }
]
