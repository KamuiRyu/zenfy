import { NextRequest } from "next/server";
import { forwardRequest } from "@/lib/api";
import { setFlash } from "@/lib/flash-message";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  return forwardRequest(req, "categories", slug);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const response = await forwardRequest(req, "categories", slug);

  if (response.status >= 200 && response.status < 300) {
    return setFlash(response, {
      type: "success",
      message: "CATEGORY_CREATED_SUCCESSFULLY",
    });
  } else {
    return setFlash(response, {
      type: "error",
      message: "CATEGORY_CREATION_FAILED",
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const response = await forwardRequest(req, "categories", slug);

   if (response.status >= 200 && response.status < 300) {
    return setFlash(response, {
      type: "success",
      message: "CATEGORY_UPDATED_SUCCESSFULLY",
    });
  } else {
    return setFlash(response, {
      type: "error",
      message: "CATEGORY_UPDATE_FAILED",
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const response = await forwardRequest(req, "categories", slug);

  if (response.status >= 200 && response.status < 300) {
    return setFlash(response, {
      type: "success",
      message: "CATEGORY_DELETED_SUCCESSFULLY",
    });
  } else {
    return setFlash(response, {
      type: "error",
      message: "CATEGORY_DELETED_FAILED",
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  return forwardRequest(req, "categories", slug);
}
