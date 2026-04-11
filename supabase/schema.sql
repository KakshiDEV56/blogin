-- Create the blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_blogs_content_fts ON blogs USING GIN(
  to_tsvector('english', title || ' ' || content)
);

-- Create users table for auth (if using Supabase Auth)
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY IF NOT EXISTS "Public can read published blogs"
  ON blogs FOR SELECT
  USING (status = 'published');

-- Users can read their own drafts
CREATE POLICY IF NOT EXISTS "Users can read their own drafts"
  ON blogs FOR SELECT
  USING (user_id = auth.uid() AND status = 'draft');

-- Users can create blogs
CREATE POLICY IF NOT EXISTS "Users can create blogs"
  ON blogs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own blogs
CREATE POLICY IF NOT EXISTS "Users can update their own blogs"
  ON blogs FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own blogs
CREATE POLICY IF NOT EXISTS "Users can delete their own blogs"
  ON blogs FOR DELETE
  USING (user_id = auth.uid());

-- Insert initial technical blog posts
INSERT INTO blogs (title, slug, content, status, user_id)
VALUES 
('Implementing a Simple TCP Stack from Scratch', 'simple-tcp-stack', 'This is a deep dive into building a TCP stack. We cover SYN/ACK handshakes, windowing, and congestion control in C++...', 'published', '00000000-0000-0000-0000-000000000000'),
('The Rust Memory Model: Ownership and Borrowing', 'rust-memory-model', 'Exploring how Rust achieves memory safety without a garbage collector. Concepts of lifetimes and move semantics.', 'published', '00000000-0000-0000-0000-000000000000'),
('Compiling Nix for Embedded RISC-V', 'nix-embedded-riscv', 'Building reproducible firmware for the StarFive VisionFive 2 using Nix flakes and cross-compilation toolchains.', 'published', '00000000-0000-0000-0000-000000000000'),
('High-Performance Networking with XDP and eBPF', 'xdp-ebpf-networking', 'Bypassing the kernel network stack for ultra-low latency packet processing using Express Data Path (XDP).', 'published', '00000000-0000-0000-0000-000000000000'),
('Building a Custom Linker in Zig', 'custom-linker-zig', 'Why ELF is complicated and how to write a minimal static linker using Zig for a hobby operating system.', 'published', '00000000-0000-0000-0000-000000000000'),
('GPU Acceleration for Fourier Transforms', 'gpu-fft-cuda', 'Implementing the Cooley-Tukey FFT algorithm in CUDA for real-time signal processing workloads.', 'published', '00000000-0000-0000-0000-000000000000'),
('Formal Verification of a Simple File System', 'formal-verification-fs', 'Using Dafny to prove the correctness of a journaled file system implementation against crashes.', 'published', '00000000-0000-0000-0000-000000000000'),
('Zero-Copy Serialization with FlatBuffers', 'zerocopy-flatbuffers', 'Optimizing microservice communication by avoiding serialization overhead. Comparing FlatBuffers vs Protocol Buffers.', 'published', '00000000-0000-0000-0000-000000000000'),
('Implementing the Lox Language in C', 'lox-c-vm', 'A walkthrough of crafting a bytecode virtual machine, garbage collector, and compiler for the Lox language.', 'published', '00000000-0000-0000-0000-000000000000'),
('The Future of Cloud: WebAssembly Components', 'wasm-component-model', 'How the Wasm Component Model and WASI 0.2 enable a new paradigm for cross-language serverless computing.', 'published', '00000000-0000-0000-0000-000000000000');
