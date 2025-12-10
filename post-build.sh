#!/bin/bash
# Post-build script to remove fronted from Lambda package

if [ -d ".aws-sam/build/ParrandaFunction/fronted" ]; then
    echo "Removing fronted directory from build..."
    rm -rf .aws-sam/build/ParrandaFunction/fronted
    echo "Done. Package size:"
    du -sh .aws-sam/build/ParrandaFunction
fi

